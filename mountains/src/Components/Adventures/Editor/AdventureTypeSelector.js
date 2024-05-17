import { useAdventureStateContext, useGetAdventures } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, ErrorField, FormField } from 'Components/Reusable'
import { ImportAdventuresButton } from '../Buttons/ImportAdventuresButton'
import { useState } from 'react'

const AdventureTypeSelector = () => {
	const { enableNewAdventureClick } = useGetAdventures()
	const { globalAdventureType } = useAdventureStateContext()
	const [hasChanged, setHasChanged] = useState(false)

	const handleChange = (event) => {
		enableNewAdventureClick({ type: event.target.value })
		setHasChanged(true)
	}

	return (
		<DisplayCard
			title={'Create a New Adventure'}
			id={'create-new-adventure-card'}
		>
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
						},
						{
							id: 'adventure-ski-approach',
							text: 'Ski Approach',
							value: 'skiApproach'
						}
					]
				}}
				value={hasChanged ? globalAdventureType : null}
				onChange={handleChange}
			/>
		</DisplayCard>
	)
}

export default AdventureTypeSelector
