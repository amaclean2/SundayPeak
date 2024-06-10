import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useGetAdventures, useZoneStateContext } from '@amaclean2/sundaypeak-treewells'

import { Field } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'

const ICON_SIZE = 25

const Adventure = ({ onClick, tick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		<span className='drop-list-image'>
			<LargeActivityIcon
				type={tick.adventure_type}
				size={ICON_SIZE}
			/>
		</span>
		<span className={'main-text'}>{tick.adventure_name}</span>
	</li>
)

const AdventuresInZone = ({ className }) => {
	const { currentZone } = useZoneStateContext()
	const { getAdventure } = useGetAdventures()
	const navigate = useNavigate()

	const openAdventure = async (adventureId, adventureType) => {
		await getAdventure({ id: adventureId, type: adventureType })

		navigate(`/adventure/${adventureType}/${adventureId}`)
	}

	if (!currentZone?.adventures.length) return null

	return (
		<Field className={cx(className, 'tick-list-container flex-box')}>
			<ul className='tick-list flex-box'>
				{currentZone.adventures?.map((adventure, key) => (
					<Adventure
						onClick={() => openAdventure(adventure.adventure_id, adventure.adventure_type)}
						tick={adventure}
						key={`zone_adventures_${key}`}
					/>
				))}
			</ul>
		</Field>
	)
}

export default AdventuresInZone
