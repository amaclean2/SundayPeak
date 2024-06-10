import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, ErrorField, FormField } from 'Components/Reusable'
import { ImportAdventuresButton } from '../Buttons/ImportAdventuresButton'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AdventureTypeSelector = () => {
	const { enableNewAdventureClick } = useGetAdventures()
	const { globalAdventureType, zoneAdd } = useAdventureStateContext()
	const { toggleAdventureAddState } = useSaveAdventure()
	const { type } = useParams()
	const navigate = useNavigate()
	const [hasChanged, setHasChanged] = useState(false)

	const handleChange = (event) => {
		enableNewAdventureClick({ type: event.target.value, isZone: type === 'zone' })
		setHasChanged(true)
	}

	useEffect(() => {
		if (zoneAdd !== null && !['ski', 'skiApproach'].includes(globalAdventureType)) {
			enableNewAdventureClick({ type: globalAdventureType, isZone: type === 'zone' })
		}
	}, [])

	const buildSelectOptions = () => {
		if (zoneAdd === null) {
			return [
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
		} else if (zoneAdd && globalAdventureType === 'ski') {
			return [
				{
					id: 'adventure-ski',
					text: 'Ski',
					value: 'ski'
				},
				{
					id: 'adventure-ski-approach',
					text: 'Ski Approach',
					value: 'skiApproach'
				}
			]
		} else {
			return []
		}
	}

	return (
		<DisplayCard
			title={`Create a New ${type === 'adventure' ? 'Adventure' : 'Area'}`}
			onClose={() => {
				navigate(-1)
				toggleAdventureAddState(false)
			}}
			id={'create-new-adventure-card'}
		>
			<p className='new-adventure-brief'>
				{zoneAdd != null
					? `Click on the map to start creating a new adventure. An editor will apear to edit the details.`
					: type === 'adventure'
					? `Select an adventure type below then  click a point on the map to add a new adventure
					starting at that point.`
					: `Select an adventure type below then click a point on the map to add a new zone at that point.`}
			</p>
			<ErrorField form='adventure' />
			{type === 'adventure' && <ImportAdventuresButton />}
			{zoneAdd === null ||
				(globalAdventureType === 'ski' && (
					<FormField
						type='select'
						name='adventure_type_selector'
						isEditable
						fullWidth
						testId={'adventure-type-selector'}
						placeholder={'Adventure Type'}
						options={{
							selectOptions: buildSelectOptions()
						}}
						value={hasChanged ? globalAdventureType : null}
						onChange={handleChange}
					/>
				))}
		</DisplayCard>
	)
}

export default AdventureTypeSelector
