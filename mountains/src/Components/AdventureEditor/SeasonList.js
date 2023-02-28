import { useEffect, useState } from 'react'
import { formatSeasons } from './utils'

const SeasonList = ({ seasons }) => {
	const [inline, setInline] = useState(null)

	useEffect(() => {
		let seasonList

		if (typeof seasons === 'string' && seasons.length) {
			seasonList = JSON.parse(seasons)
		} else if ((typeof seasons === 'string' && !seasons.length) || !seasons) {
			seasonList = []
		} else {
			seasonList = seasons
		}

		const formattedStr = formatSeasons({ seasonArray: seasonList })
		setInline(formattedStr)
	}, [seasons])

	return inline
}

export default SeasonList
