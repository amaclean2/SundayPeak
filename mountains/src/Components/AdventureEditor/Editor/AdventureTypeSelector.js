import { ConfirmationPage, FormField } from 'Components/Reusable'
import { useCardStateContext } from 'Providers'

const AdventureTypeSelector = ({ adventureType, setAdventureType }) => {
	const { screenType, cardDispatch } = useCardStateContext()

	const handleChange = (event) => {
		setAdventureType(event.target.value)

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
				placeholder={'Select an Adventure Type'}
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
				value={adventureType || 0}
				onChange={handleChange}
			/>
		</ConfirmationPage>
	)
}

export default AdventureTypeSelector
