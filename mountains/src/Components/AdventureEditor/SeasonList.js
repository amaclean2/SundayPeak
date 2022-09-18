import { useEffect, useState } from 'react'
import { seasonOptions } from './utils'

const SeasonList = ({ seasons }) => {
	const [seasonList, setSeasonList] = useState(null)
	const [inline, setInline] = useState(null)

	useEffect(() => {
		if (seasonList) {
			let lastValue
			const inlineList = seasonList.reduce((newList, value) => {
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
			setInline(formattedStr)
		} else {
			setSeasonList(typeof seasons === 'string' ? JSON.parse(seasons) : seasons)
		}
	}, [seasonList, seasons])

	if (!seasonList) return null

	return inline
}

export default SeasonList
