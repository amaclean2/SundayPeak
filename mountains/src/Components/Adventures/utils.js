import { lists } from 'TextContent/lists'
import getContent from '../../TextContent'

export const seasonOptions = Object.values(lists.months)
export const gearOptions = Object.values(lists.gear)

export const directionSelectOptions = [
	{
		id: 0,
		text: getContent('lists.directions.north'),
		value: 'N'
	},
	{
		id: 1,
		text: getContent('lists.directions.northEast'),
		value: 'NE'
	},
	{
		id: 2,
		text: getContent('lists.directions.east'),
		value: 'E'
	},
	{
		id: 3,
		text: getContent('lists.directions.southEast'),
		value: 'SE'
	},
	{
		id: 4,
		text: getContent('lists.directions.south'),
		value: 'S'
	},
	{
		id: 5,
		text: getContent('lists.directions.southWest'),
		value: 'SW'
	},
	{
		id: 6,
		text: getContent('lists.directions.west'),
		value: 'W'
	},
	{
		id: 7,
		text: getContent('lists.directions.northWest'),
		value: 'NW'
	}
]

export const climbTypeSelection = [
	{
		id: 'climb-boulder',
		value: 'boulder',
		text: 'Boulder'
	},
	{
		id: 'climb-sport',
		value: 'sport',
		text: 'Sport'
	},
	{
		id: 'climb-trad',
		value: 'trad',
		text: 'Trad'
	},
	{
		id: 'climb-alpine',
		value: 'alpine',
		text: 'Alpine'
	},
	{
		id: 'climb-ice',
		value: 'ice',
		text: 'Ice'
	}
]

export const pitchClimbs = ['sport', 'trad', 'ice']

const yds = [
	'5.2',
	'5.3',
	'5.4',
	'5.5',
	'5.6',
	'5.7',
	'5.8',
	'5.9',
	'5.10a',
	'5.10b',
	'5.10c',
	'5.10d',
	'5.11a',
	'5.11b',
	'5.11c',
	'5.11d',
	'5.12a',
	'5.12b',
	'5.12c',
	'5.12d',
	'5.13a',
	'5.13b',
	'5.13c',
	'5.13d',
	'5.14a',
	'5.14b',
	'5.14c',
	'5.14d',
	'5.15a',
	'5.15b'
]

export const getClimbGrade = ({ climbType }) => {
	switch (climbType) {
		case 'boulder':
			return Array(16)
				.fill('')
				.map((_, idx) => ({
					id: `v-${idx + 1}`,
					value: idx,
					text: `V${idx + 1}`
				}))
		case 'sport':
		case 'trad':
			return yds.map((text, value) => ({
				id: text.split('.')[1],
				value,
				text
			}))
		case 'ice':
		case 'alpine':
			return [
				{
					id: 'something',
					text: 'Something',
					value: 'Something'
				}
			]
		default:
			return [
				{
					id: 0,
					text: 'Please select a climb type',
					value: 'nothing'
				}
			]
	}
}

export const rangeValues = {
	min: 0,
	max: 5,
	step: 1
}

export const formatSeasons = ({ seasonArray }) => {
	// seasonArray is a list of 12 true/false values representing whether
	// the adventure is in for that month

	if (seasonArray.every((month) => month)) {
		return 'All year'
	} else if (!seasonArray.some((month) => month)) {
		return 'Never'
	}

	let lastValue
	const inlineList = seasonArray.reduce((newList, value, idx) => {
		if (!value) {
			return newList
		}

		if (lastValue === undefined) {
			lastValue = idx
			return [seasonOptions[idx]]
		} else if (idx - lastValue === 1) {
			if (newList.length > 1) {
				newList.pop()
				if (newList[newList.length - 1] !== 0) {
					newList = [...newList, 0]
				}
			}

			lastValue = idx
			return [...newList, seasonOptions[idx]]
		} else {
			lastValue = idx
			return [...newList, seasonOptions[idx]]
		}
	}, [])

	const stringyList = inlineList.join(', ')
	const formattedStr = stringyList.replace(/, 0,/g, ' -')

	return formattedStr
}

export const formatGearList = ({ gear }) => gearOptions.filter((_, idx) => gear[idx]).join(', ')
