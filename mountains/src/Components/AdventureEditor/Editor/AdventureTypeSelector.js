import { ConfirmationPage, FormField } from 'Components/Reusable'
import { useAdventureStateContext, useCardStateContext, useGetAdventures } from 'Providers'

const AdventureTypeSelector = ({ setAddAdventureInstructions }) => {
	const { screenType, cardDispatch } = useCardStateContext()
	const { changeAdventureType } = useGetAdventures()
	const { adventureTypeViewer } = useAdventureStateContext()

	const handleChange = (event) => {
		changeAdventureType(event.target.value)
		setAddAdventureInstructions((currInstructions) => !currInstructions)

		if (screenType.mobile) {
			cardDispatch({ type: 'closeCard' })
		}
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
				value={adventureTypeViewer || 'ski'}
				onChange={handleChange}
			/>
		</ConfirmationPage>
	)
}

export default AdventureTypeSelector
