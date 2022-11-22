import getContent from '../../TextContent'

export const seasonOptions = [
	getContent('lists.months.jan'),
	getContent('lists.months.feb'),
	getContent('lists.months.mar'),
	getContent('lists.months.apr'),
	getContent('lists.months.may'),
	getContent('lists.months.jun'),
	getContent('lists.months.jul'),
	getContent('lists.months.aug'),
	getContent('lists.months.sep'),
	getContent('lists.months.oct'),
	getContent('lists.months.nov'),
	getContent('lists.months.dec')
]

export const gearOptions = [
	getContent('lists.gear.rope'),
	getContent('lists.gear.axe'),
	getContent('lists.gear.kit'),
	getContent('lists.gear.skins'),
	getContent('lists.gear.crampons')
]

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

export const rangeValues = {
	min: 0,
	max: 5,
	step: 1
}

export const formatSeasons = ({ seasonArray }) => {
	let lastValue
	const inlineList = seasonArray.reduce((newList, value) => {
		if (!lastValue) {
			lastValue = value
			return [seasonOptions[Number(value) - 1]]
		} else if (value - lastValue === 1) {
			if (newList.length > 1) {
				newList = newList.slice(0, -1)
				if (newList[newList.length - 1] !== 0) {
					newList = [...newList, 0]
				}
			}

			lastValue = value
			return [...newList, seasonOptions[Number(value) - 1]]
		} else {
			return [...newList, seasonOptions[Number(value) - 1]]
		}
	}, [])

	const stringyList = inlineList.join(', ')
	const formattedStr = stringyList.replace(/, 0,/g, ' -')

	return formattedStr
}
