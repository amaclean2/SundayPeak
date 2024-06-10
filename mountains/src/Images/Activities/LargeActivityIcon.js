import { useAdventureStateContext } from '@amaclean2/sundaypeak-treewells'
import React from 'react'
import { LargeSkierIcon } from './LargeSkierIcon'
import { LargeBikerIcon } from './LargeBikerIcon'
import { LargeHikerIcon } from './LargeHikerIcon'
import { LargeClimberIcon } from './LargeClimberIcon'
import { LargeTourerIcon } from './LargeTourerIcon'

export const LargeActivityIcon = ({ type, size, color, className }) => {
	const { globalAdventureType } = useAdventureStateContext()

	const props = { size, color, className }

	switch (type ?? globalAdventureType) {
		case 'ski':
			return <LargeSkierIcon {...props} />
		case 'skiApproach':
			return <LargeTourerIcon {...props} />
		case 'bike':
			return <LargeBikerIcon {...props} />
		case 'hike':
			return <LargeHikerIcon {...props} />
		case 'climb':
			return <LargeClimberIcon {...props} />
	}
}
