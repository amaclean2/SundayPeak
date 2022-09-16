import { useEffect, useState } from 'react'
import { seasonOptions } from './utils'

const SeasonList = ({ seasons }) => {
	const [seasonList, setSeasonList] = useState(null)
	const [inline, setInline] = useState(false)

	useEffect(() => {
		if (seasonList && typeof seasonList === 'object') {
			let lastValue
			const testInline = seasonList.every((value) => {
				if (!lastValue) {
					return true
				} else {
					return value - lastValue === 1
				}
			})

			setInline(testInline)
		} else {
			setSeasonList(typeof seasons === 'string' ? JSON.parse(seasons) : seasons)
		}
	}, [seasonList, seasons])

	if (!seasonList) return null

	if (inline) {
		return `${seasonOptions[seasonList[0] - 1]} - ${
			seasonOptions[seasonList[seasonList.length - 1] - 1]
		}`
	} else {
		return <>{seasonList.map((item, key) => `${seasonOptions[item - 1]}`)}</>
	}
}

export default SeasonList
