import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	useAdventureStateContext,
	useDeleteAdventure,
	useGetZones,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, FlexSpacer, FooterButtons } from 'Components/Reusable'

import DeletePage from '../DeletePage'
import ZoneFields from './Fields'

const ZoneForm = () => {
	const { zoneId } = useParams()
	const navigate = useNavigate()

	const { isDeletePageOpen } = useAdventureStateContext()
	const { currentZone } = useZoneStateContext()
	const { toggleDeletePage } = useDeleteAdventure()
	const { getZone } = useGetZones()

	useEffect(() => {
		if (!currentZone || currentZone?.id.toString() !== zoneId) {
			getZone({ id: zoneId })
		}
	}, [currentZone, zoneId])

	return (
		<DisplayCard
			title={currentZone?.zone_name ?? 'New Zone'}
			className={'zone-edit'}
			onClose={() => navigate(-1)}
		>
			<div className='flex-box flex-edit-fields'>
				<ZoneFields />
				<FlexSpacer />
			</div>
			<FooterButtons row>
				<Button direction={`/zone/${currentZone?.id}`}>Finish</Button>
				<Button
					className={'delete-button'}
					id={'zone-delete-button'}
					onClick={toggleDeletePage}
				>
					Delete Area
				</Button>
			</FooterButtons>
			{isDeletePageOpen && <DeletePage />}
		</DisplayCard>
	)
}

export default ZoneForm
