import { useAdventureEditContext } from '../../Providers'
import { ErrorField, FormField, Accordion } from '../Reusable'
import MultiField from '../Reusable/FormField/MultiField'
import { directionSelectOptions, gearOptions, seasonOptions } from './utils'

const AdventureEditorForm = ({ onChange }) => {
	const { currentAdventure } = useAdventureEditContext()

	return (
		<div className='adventure-info flex-box'>
			<ErrorField form={'adventure'} />
			<FormField
				name='bio'
				label='Description'
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.bio}
				autoFocus={true}
				onChange={onChange}
			/>
			<FormField
				name='approach_distance'
				label='Approach Distance'
				isEditable
				fullWidth
				options={{ suffix: 'miles' }}
				value={currentAdventure.approach_distance}
				onChange={onChange}
			/>
			<MultiField
				onChange={onChange}
				label={'Elevation'}
				fields={[
					{
						type: 'text',
						name: 'elevation',
						value: currentAdventure.elevation,
						placeholder: 'Summit Elevation'
					},
					{
						type: 'text',
						name: 'gain',
						value: currentAdventure.gain,
						placeholder: 'Elevation Gain'
					}
				]}
			/>
			<Accordion title={'Season Picker'}>
				<FormField
					name='season'
					label='Best Months'
					type='selectMany'
					options={{ selectMany: seasonOptions }}
					isEditable
					fullWidth
					value={currentAdventure.season}
					onChange={onChange}
				/>
			</Accordion>
			<Accordion title={'Gear Picker'}>
				<FormField
					name='gear'
					label='Gear Required'
					type='selectMany'
					options={{ selectMany: gearOptions }}
					isEditable
					fullWidth
					value={currentAdventure.gear}
					onChange={onChange}
				/>
			</Accordion>
			<Accordion title={'Slope'}>
				<FormField
					name='avg_angle'
					label='Average Slope Angle'
					isEditable
					fullWidth
					value={currentAdventure.avg_angle}
					options={{ suffix: 'degrees' }}
					onChange={onChange}
				/>
				<FormField
					name='max_angle'
					label='Max Slope Angle'
					isEditable
					fullWidth
					value={currentAdventure.max_angle}
					options={{ suffix: 'degrees' }}
					onChange={onChange}
				/>
				<FormField
					name='aspect'
					label='Aspect'
					type='select'
					isEditable
					fullWidth
					options={{
						selectOptions: directionSelectOptions
					}}
					value={currentAdventure.aspect}
					onChange={onChange}
				/>
			</Accordion>
			<Accordion title={'Experience'}>
				<FormField
					name='difficulty'
					label='Difficulty'
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
					value={currentAdventure.difficulty}
					onChange={onChange}
				/>
				<FormField
					name='exposure'
					label='Exposure'
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
					value={currentAdventure.exposure}
					onChange={onChange}
				/>
			</Accordion>
			<FormField
				name='nearest_city'
				label='Nearest City'
				isEditable
				fullWidth
				value={currentAdventure.nearest_city}
				onChange={onChange}
			/>
		</div>
	)
}

export default AdventureEditorForm
