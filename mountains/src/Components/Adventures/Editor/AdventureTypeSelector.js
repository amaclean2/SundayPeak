import { useState } from 'react'

import { FormField } from 'Components/Reusable'
import { useGetAdventures } from 'Hooks'
import { useAdventureStateContext } from 'Hooks/Providers'
import { ImportAdventuresButton } from '../Buttons/ImportAdventuresButton'

const AdventureTypeSelector = () => {
	const { changeAdventureType } = useGetAdventures()
	const { adventureDispatch } = useAdventureStateContext()
	const [localAdventureType, setLocalAdventureType] = useState(null)

	const handleChange = (event) => {
		const newAdventureType = event.target.value

		setLocalAdventureType(newAdventureType)
		changeAdventureType({ type: newAdventureType })
		adventureDispatch({ type: 'enableMapToAddAdventure' })
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
