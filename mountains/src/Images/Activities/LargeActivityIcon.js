import { useAdventureStateContext } from '@amaclean2/sundaypeak-treewells'
import React from 'react'
import { LargeSkierIcon } from './LargeSkierIcon'
import { LargeBikerIcon } from './LargeBikerIcon'
import { LargeHikerIcon } from './LargeHikerIcon'
import { LargeClimberIcon } from './LargeClimberIcon'

export const LargeActivityIcon = ({ type, size, color, className }) => {
	const { globalAdventureType } = useAdventureStateContext()

	const props = { size, color, className }

	switch (type ?? globalAdventureType) {
		case 'ski':
		case 'skiApproach':
			return <LargeSkierIcon {...props} />
		case 'bike':
			return <LargeBikerIcon {...props} />
		case 'hike':
			return <LargeHikerIcon {...props} />
		case 'climb':
			return <LargeClimberIcon {...props} />
	}
}
