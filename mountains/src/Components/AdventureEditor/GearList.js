import { useEffect, useState } from 'react'
import { gearOptions } from './utils'

const GearList = ({ gear }) => {
	const [gearList, setGearList] = useState(null)

	useEffect(() => {
		setGearList(typeof gear === 'string' ? JSON.parse(gear) : gear)
	}, [gear])

	if (!gearList) return null

	return (
		<>
			{gearList.map((item, key) => (
				<div key={`gear_item_${key}`}>{gearOptions[item - 1]}</div>
			))}
		</>
	)
}

export default GearList
