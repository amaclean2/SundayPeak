import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import './styles.css'
import { useAdventureStateContext } from '@amaclean2/sundaypeak-treewells'

const NearbyCards = ({ adventures }) => {
	const { currentAdventure } = useAdventureStateContext()
	return (
		<div className={'scroller-container flex-box'}>
			{adventures?.map((adv, idx) => (
				<>
					{adv?.id !== currentAdventure.id && (
						<NearbyCard
							key={`nearby_adventure_${idx}`}
							adventure={adv}
						/>
					)}
				</>
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
