import { useState } from 'react'
import { useGetAdventures } from 'sundaypeak-treewells'

import { FormField } from 'Components/Reusable'
import { ImportAdventuresButton } from '../Buttons/ImportAdventuresButton'

const AdventureTypeSelector = () => {
	const { changeAdventureType } = useGetAdventures()
	const [localAdventureType, setLocalAdventureType] = useState(null)

	const handleChange = (event) => {
		setLocalAdventureType(event.target.value)
		changeAdventureType({ type: event.target.value })
	}

	return (
		<>
			<p className='new-adventure-brief'>
				Select an adventure type below then double click a point on the map to add a new adventure
				starting at that point.
			</p>
			<ImportAdventuresButton />
			<FormField
				type='select'
				name='adventure_type_selector'
				isEditable
				fullWidth
				testId={'adventure-type-selector'}
				placeholder={'Adventure Type'}
				options={{
					selectOptions: [
						{
							id: 'adventure-ski',
							text: 'Ski',
							value: 'ski'
						},
						{
							id: 'adventure-climb',
							text: 'Climb',
							value: 'climb'
						},
						{
							id: 'adventure-hike',
							text: 'Hike',
							value: 'hike'
						}
					]
				}}
				value={localAdventureType}
				onChange={handleChange}
			/>
		</>
	)
}

export default AdventureTypeSelector
