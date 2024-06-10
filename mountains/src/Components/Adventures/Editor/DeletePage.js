import {
	useAdventureStateContext,
	useDeleteAdventure,
	useDeleteZone,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'

import { Button, FieldHeader, FooterButtons } from 'Components/Reusable'
import ClickWrapper from 'Components/Reusable/ClickWrapper'
import { useNavigate } from 'react-router-dom'

const DeletePage = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { currentZone } = useZoneStateContext()
	const { deleteAdventure, toggleDeletePage } = useDeleteAdventure()
	const { deleteZone } = useDeleteZone()
	const navigate = useNavigate()

	const currentObject = currentZone ?? currentAdventure

	return (
		<div className={'click-wrapper flex-box'}>
			<ClickWrapper onClick={toggleDeletePage}>
				<div className={'delete-page flex-box'}>
					<FieldHeader>{`Delete "${
						currentObject.zone_name ?? currentObject.adventure_name
					}"?`}</FieldHeader>
					<p>
						{currentObject.zone_name
							? 'Make sure before deleting a zone. Once a zone is deleted, it cannot be undone.'
							: 'Make sure before deleting an activity. Once an activity is deleted, it cannot be undone.'}
					</p>
					<FooterButtons>
						<Button
							onClick={() => {
								if (currentObject.zone_name !== undefined) {
									deleteZone({ zoneId: currentZone.id })
								} else {
									deleteAdventure({
										adventureId: currentAdventure.id,
										adventureType: currentAdventure.adventure_type,
										adventureName: currentAdventure.adventure_name
									})
								}
								navigate('/discover')
							}}
							id={`delete-adventure-${currentAdventure?.id ?? currentZone.id}`}
							className={'delete-button'}
						>
							Accept
						</Button>
						<Button
							onClick={toggleDeletePage}
							id={'cancel-delete-adventure'}
							className={'secondary-button'}
						>
							Cancel
						</Button>
					</FooterButtons>
				</div>
			</ClickWrapper>
		</div>
	)
}

export default DeletePage
