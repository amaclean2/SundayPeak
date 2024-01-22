import { useState } from 'react'
import { useGetAdventures } from '@amaclean2/sundaypeak-treewells'

import { ErrorField, FormField } from 'Components/Reusable'
import { ImportAdventuresButton } from '../Buttons/ImportAdventuresButton'

const AdventureTypeSelector = () => {
	const { enableNewAdventureClick } = useGetAdventures()
	const [localAdventureType, setLocalAdventureType] = useState(null)

	const handleChange = (event) => {
		setLocalAdventureType(event.target.value)
		enableNewAdventureClick({ type: event.target.value })
	}

	return (
		<>
			<p className='new-adventure-brief'>
				Select an adventure type below then double click a point on the map to add a new adventure
				starting at that point.
			</p>
			<ErrorField form='adventure' />
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
						},
						{
							id: 'adventure-bike',
							text: 'Bike',
							value: 'bike'
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
