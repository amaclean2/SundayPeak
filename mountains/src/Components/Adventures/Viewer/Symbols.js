import React from 'react'
import { AspectIcon } from '../../../Images/Symbols/AspectIcon'
import DifficultyGraphic from '../../../Images/Symbols/Difficulty'

export const DifficultyViewer = ({ difficulty }) => {
	return <DifficultyGraphic difficultyLevel={Math.round(Number(difficulty.split(':')[0]))} />
}

export const ExposureViewer = ({ exposure }) => {
	return `E${exposure}`
}

export const Aspect = ({ aspect }) => {
	switch (aspect) {
		case 'N':
			return <AspectIcon direction={'north'} />
		case 'NE':
			return <AspectIcon direction={'north-east'} />
		case 'SE':
			return <AspectIcon direction={'south-east'} />
		case 'S':
			return <AspectIcon direction={'south'} />
		case 'SW':
			return <AspectIcon direction={'south-west'} />
		case 'W':
			return <AspectIcon direction={'west'} />
		case 'NW':
			return <AspectIcon direction={'north-west'} />
		default:
			return <AspectIcon />
	}
}
