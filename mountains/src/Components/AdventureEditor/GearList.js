import { useRef } from 'react'
import { gearOptions } from './utils'

const GearList = ({ gear }) => {
	const parsedGearList = useRef(null)

	if (typeof gear === 'string' && gear.length) {
		parsedGearList.current = JSON.parse(gear)
	} else if (typeof gear === 'string' && !gear.length) {
		parsedGearList.current = []
	} else {
		parsedGearList.current = gear
	}

	return (
		<>
			{parsedGearList.map((item, key) => (
				<div key={`gear_item_${key}`}>{gearOptions[item - 1]}</div>
			))}
		</>
	)
}

export default GearList
