import { useState } from 'react'

import { ConfirmationPage, FormField } from 'Components/Reusable'
import { useGetAdventures } from 'Providers'

const AdventureTypeSelector = ({ setAddAdventureInstructions }) => {
	const { changeAdventureType } = useGetAdventures()
	const [newAdventureType, setNewAdventureType] = useState(null)

	const handleChange = (event) => {
		setNewAdventureType(event.target.value)
		setAddAdventureInstructions((currInstructions) => !currInstructions)
		changeAdventureType(event.target.value)
	}

	return (
		<ConfirmationPage>
			<FormField
				type='select'
				name='adventure_type_selector'
				isEditable
				fullWidth
				label={'Select an Adventure Type'}
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
				value={newAdventureType}
				onChange={handleChange}
			/>
		</ConfirmationPage>
	)
}

export default AdventureTypeSelector
