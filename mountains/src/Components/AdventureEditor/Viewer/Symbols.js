import React from 'react'
import { AspectIcon } from '../../../Images/AspectIcon'
import {
	DifficultyEasyIcon,
	DifficultyHardIcon,
	DifficultyMediumIcon
} from '../../../Images/Difficulty'
import { ExposureS } from '../../../Images/Exposure'

export const DifficultyViewer = ({ difficulty }) => {
	switch (Number(difficulty)) {
		case 1:
			return <DifficultyEasyIcon />
		case 2:
			return <DifficultyMediumIcon />
		default:
			return <DifficultyHardIcon />
	}
}

export const ExposureViewer = ({ exposure }) => {
	switch (exposure) {
		default:
			return <ExposureS />
	}
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
