import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useGetZones, useZoneStateContext } from '@amaclean2/sundaypeak-treewells'

import { Field, FieldHeader } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'

const ICON_SIZE = 25

const Zone = ({ onClick, tick }) => (
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
		<span className={'main-text'}>{tick.zone_name}</span>
	</li>
)

const ZonesInZone = ({ className }) => {
	const { currentZone } = useZoneStateContext()
	const { getZone } = useGetZones()
	const navigate = useNavigate()

	const openZone = async (zoneId) => {
		await getZone({ id: zoneId })

		navigate(`/zone/${zoneId}`)
	}

	if (!currentZone?.zones.length) return null

	return (
		<Field className={cx(className, 'tick-list-container flex-box')}>
			<ul className='tick-list flex-box'>
				{currentZone.zones?.map((zone, key) => (
					<Zone
						onClick={() => openZone(zone.zone_id)}
						tick={zone}
						key={`zone_subzones_${key}`}
					/>
				))}
			</ul>
		</Field>
	)
}

export default ZonesInZone
