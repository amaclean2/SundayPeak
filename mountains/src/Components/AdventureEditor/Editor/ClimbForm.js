import { Accordion, ErrorField, FormField, MultiField } from 'Components/Reusable'
import { useAdventureStateContext } from 'Providers'
import getContent from 'TextContent'
import {
	climbTypeSelection,
	getClimbGrade,
	pitchClimbs,
	seasonOptions
} from 'Components/AdventureEditor/utils'

const ClimbForm = ({ onChange }) => {
	const { currentAdventure } = useAdventureStateContext()

	/**
   * grade VARCHAR(50),
    pitches INT,
    protection VARCHAR(100),
    climb_type VARCHAR(100),
    light_times VARCHAR(100),
    season VARCHAR(100),
   */

	return (
		<div className='adventure-info flex-box'>
			<ErrorField form={'adventure'} />
			<FormField
				type='noedit'
				name='adventure_type'
				label={'Adventure Type'}
				value={currentAdventure.adventure_type || 'ski'}
				isEditable
				onChange={() => {}}
			/>
			<FormField
				name='bio'
				label={getContent('adventurePanel.editable.description')}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.bio || ''}
				autoFocus={true}
				onChange={onChange}
			/>
			<MultiField
				onChange={onChange}
				label={'Climb Info'}
				fields={[
					{
						type: 'select',
						name: 'climb_type',
						value: currentAdventure.climb_type || 'Trad',
						options: { selectOptions: climbTypeSelection }
					},
					{
						type: 'select',
						name: 'grade',
						value: currentAdventure.grade || 'Please select a climb type',
						options: { selectOptions: getClimbGrade({ climbType: currentAdventure.climb_type }) }
					}
				]}
			/>
			<FormField
				name='first_ascent'
				label={'First Ascent'}
				isEditable
				fullWidth
				value={currentAdventure.first_ascent || ''}
				onChange={onChange}
			/>
			{pitchClimbs.includes(currentAdventure.climb_type) && (
				<Accordion title={'Pitch Climbing'}>
					<FormField
						name='pitches'
						label={'Pitches'}
						isEditable
						fullWidth
						value={currentAdventure.pitches || ''}
						onChange={onChange}
					/>
					<FormField
						name='protection'
						label={'Pro'}
						isEditable
						fullWidth
						value={currentAdventure.protection || ''}
						onChange={onChange}
					/>
				</Accordion>
			)}
			<Accordion title={getContent('adventurePanel.editable.seasonPicker')}>
				<FormField
					name='season'
					label={getContent('adventurePanel.editable.bestMonths')}
					type='selectmany'
					options={{ selectMany: seasonOptions }}
					isEditable
					fullWidth
					value={currentAdventure.season || ''}
					onChange={onChange}
				/>
			</Accordion>
			<FormField
				name='approach'
				label={'Approach'}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.approach || ''}
				onChange={onChange}
			/>
			<FormField
				name='nearest_city'
				label={getContent('adventurePanel.editable.nearest')}
				isEditable
				fullWidth
				value={currentAdventure.nearest_city || ''}
				onChange={onChange}
			/>
			<FormField
				name='public'
				label={getContent('adventurePanel.editable.isPublic')}
				type={'checkbox'}
				isEditable
				fullWidth
				value={currentAdventure.public || true}
				onChange={onChange}
			/>
		</div>
	)
}

export default ClimbForm
