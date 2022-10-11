import { useEffect, useState } from 'react'
import { formatSeasons } from './utils'

const SeasonList = ({ seasons }) => {
	const [seasonList, setSeasonList] = useState(null)
	const [inline, setInline] = useState(null)

	useEffect(() => {
		if (seasonList) {
			const formattedStr = formatSeasons({ seasonArray: seasonList })
			setInline(formattedStr)
		} else {
			setSeasonList(typeof seasons === 'string' ? JSON.parse(seasons) : seasons)
		}
	}, [seasonList, seasons])

	if (!seasonList) return null

	return inline
}

export default SeasonList
