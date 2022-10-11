export const seasonOptions = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

export const gearOptions = ['Rope', 'Ice Axe', 'Glacier Kit', 'Skins', 'Crampons']

export const directionSelectOptions = [
	{
		id: 0,
		text: 'North',
		value: 'N'
	},
	{
		id: 1,
		text: 'North East',
		value: 'NE'
	},
	{
		id: 2,
		text: 'East',
		value: 'E'
	},
	{
		id: 3,
		text: 'South East',
		value: 'SE'
	},
	{
		id: 4,
		text: 'South',
		value: 'S'
	},
	{
		id: 5,
		text: 'South West',
		value: 'SW'
	},
	{
		id: 6,
		text: 'West',
		value: 'W'
	},
	{
		id: 7,
		text: 'North West',
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
