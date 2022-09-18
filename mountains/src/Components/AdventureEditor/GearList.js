import { useEffect, useState } from 'react'
import { gearOptions } from './utils'

const GearList = ({ gear }) => {
	const [gearList, setGearList] = useState(null)

	useEffect(() => {
		setGearList(typeof gear === 'string' ? JSON.parse(gear) : gear)
	}, [gear])

	if (!gearList) return null

	return <>{gearList.map((item) => gearOptions[item - 1])}</>
}

export default GearList
