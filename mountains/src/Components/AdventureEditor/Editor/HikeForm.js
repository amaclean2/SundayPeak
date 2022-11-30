import { Accordion, ErrorField, FormField, MultiField } from 'Components/Reusable'
import { useAdventureStateContext } from 'Providers'
import getContent from 'TextContent'
import {
	directionSelectOptions,
	gearOptions,
	seasonOptions
} from 'Components/AdventureEditor/utils'

const HikeForm = ({ onChange }) => {
	const { currentAdventure } = useAdventureStateContext()

	return (
		<div className='adventure-info flex-box'>
			<ErrorField form={'adventure'} />
			<FormField
				type='noedit'
				name='adventure_type'
				label={'Adventure Type'}
				value={currentAdventure.adventure_type}
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
			<FormField
				name='approach_distance'
				label={getContent('adventurePanel.editable.approachDistance')}
				isEditable
				fullWidth
				options={{ suffix: 'miles' }}
				value={currentAdventure.approach_distance || ''}
				onChange={onChange}
			/>
			<MultiField
				onChange={onChange}
				label={getContent('adventurePanel.fields.elevation')}
				fields={[
					{
						type: 'text',
						name: 'elevation',
						value: currentAdventure.elevation || '',
						placeholder: getContent('adventurePanel.editable.summit')
					},
					{
						type: 'text',
						name: 'gain',
						value: currentAdventure.gain || '',
						placeholder: getContent('adventurePanel.editable.elevationGain')
					}
				]}
			/>
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
			<Accordion title={getContent('adventurePanel.editable.gearPicker')}>
				<FormField
					name='gear'
					label={getContent('adventurePanel.editable.gearRequired')}
					type='selectmany'
					options={{ selectMany: gearOptions }}
					isEditable
					fullWidth
					value={currentAdventure.gear || ''}
					onChange={onChange}
				/>
			</Accordion>
			<Accordion title={getContent('adventurePanel.editable.slope')}>
				<FormField
					name='avg_angle'
					label={getContent('adventurePanel.editable.avgAngle')}
					isEditable
					fullWidth
					value={currentAdventure.avg_angle || ''}
					options={{ suffix: 'degrees' }}
					onChange={onChange}
				/>
				<FormField
					name='max_angle'
					label={getContent('adventurePanel.editable.maxAngle')}
					isEditable
					fullWidth
					value={currentAdventure.max_angle || ''}
					options={{ suffix: 'degrees' }}
					onChange={onChange}
				/>
				<FormField
					name='aspect'
					label={getContent('adventurePanel.fields.aspect')}
					type='select'
					isEditable
					fullWidth
					options={{
						selectOptions: directionSelectOptions
					}}
					value={currentAdventure.aspect || 'N'}
					onChange={onChange}
				/>
			</Accordion>
			<Accordion title={getContent('adventurePanel.editable.experience')}>
				<FormField
					name='difficulty'
					label={getContent('adventurePanel.fields.difficulty')}
					type='range'
					options={{
						range: {
							min: 1,
							max: 3,
							step: 1
						}
					}}
					isEditable
					fullWidth
					value={currentAdventure.difficulty || ''}
					onChange={onChange}
				/>
				<FormField
					name='exposure'
					label={getContent('adventurePanel.fields.exposure')}
					type='range'
					options={{
						range: {
							min: 0,
							max: 5,
							step: 1
						}
					}}
					isEditable
					fullWidth
					value={currentAdventure.exposure || ''}
					onChange={onChange}
				/>
			</Accordion>
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

export default HikeForm
