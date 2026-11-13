import React from 'react'
import { useAdventureStateContext } from 'State'
import { LargeActivityIcon } from 'Images'

import './styles.css'

const adventureTypeLabels = {
	ski: 'Ski',
	skiApproach: 'Ski Approach',
	climb: 'Climb',
	hike: 'Hike',
	bike: 'Bike'
}

const AdventureTypeTag = ({ type, label }) => {
	const { currentAdventure } = useAdventureStateContext()
	const adventureType = type ?? currentAdventure?.adventure_type
	const displayLabel = label ?? adventureTypeLabels[adventureType]

	if (!displayLabel) return null

	return (
		<span className={'adventure-type-tag'}>
			<LargeActivityIcon
				type={adventureType}
				size={12}
				color={'#02ad85'}
			/>
			{displayLabel}
		</span>
	)
}

export default AdventureTypeTag
