import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import './styles.css'
import { useAdventureStateContext, useZoneStateContext } from '@amaclean2/sundaypeak-treewells'

const NearbyCards = ({ adventures }) => {
	const { currentAdventure } = useAdventureStateContext()
	return (
		<div className={'scroller-container flex-box'}>
			{adventures?.map((adv, idx) => (
				<Fragment key={`nearby_adventure_${idx}`}>
					{adv?.id !== currentAdventure.id && <NearbyCard adventure={adv} />}
				</Fragment>
			))}
		</div>
	)
}

const NearbyCard = ({ adventure }) => {
	const navigate = useNavigate()

	return (
		<div
			onClick={() => navigate(`/adventure/${adventure.adventure_type}/${adventure.id}`)}
			className={'nearby-card flex-box'}
		>
			{adventure.adventure_name}
		</div>
	)
}

export const NearbyZoneCards = ({ zones }) => {
	const { currentZone } = useZoneStateContext()
	return (
		<div className='scroller-container flex-box'>
			{zones?.map((zone, idx) => (
				<Fragment key={`nearby_zone_${idx}`}>
					{zone?.zone_id !== currentZone.id && <NearbyZoneCard zone={zone} />}
				</Fragment>
			))}
		</div>
	)
}

const NearbyZoneCard = ({ zone }) => {
	const navigate = useNavigate()

	return (
		<div
			onClick={() => navigate(`/zone/${zone.zone_id}`)}
			className={'nearby-card flex-box'}
		>
			{zone.zone_name}
		</div>
	)
}

NearbyCard.propTypes = {
	adventure: PropTypes.shape({
		adventure_name: PropTypes.string,
		id: PropTypes.number,
		adventure_type: PropTypes.string,
		bio: PropTypes.string,
		difficulty: PropTypes.string,
		nearest_city: PropTypes.string,
		rating: PropTypes.string
	})
}

export default NearbyCards
