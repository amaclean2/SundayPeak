import { useEffect, useRef, useState } from 'react'
import { formatSeasons } from './utils'

const SeasonList = ({ seasons }) => {
	const seasonList = useRef(null)
	const [inline, setInline] = useState(null)

	useEffect(() => {
		if (typeof seasons === 'string' && seasons.length) {
			seasonList.current = JSON.parse(seasons)
		} else if ((typeof seasons === 'string' && !seasons.length) || !seasons) {
			seasonList.current = []
		} else {
			seasonList.currrent = seasons
		}

		const formattedStr = formatSeasons({ seasonArray: seasonList.current })
		setInline(formattedStr)
	}, [seasons])

	return inline
}

export default SeasonList
