import { useAdventureEditContext } from '../../Providers'
import { ErrorField, FormField, Accordion } from '../Reusable'
import { gearOptions, rangeValues, seasonOptions } from './utils'

const AdventureEditorForm = ({ onChange }) => {
	const { currentAdventure } = useAdventureEditContext()

	console.log({ currentAdventure })

	return (
		<div className='adventure-info flex-box'>
			<ErrorField form={'adventure'} />
			<FormField
				name='bio'
				label='Bio'
				type='textarea'
				isEditable={true}
				fullWidth
				value={currentAdventure.bio}
				onChange={onChange}
			/>
			<FormField
				name='approach_distance'
				label='Approach Distance'
				isEditable={true}
				fullWidth
				options={{ suffix: 'miles' }}
				value={currentAdventure.approach_distance}
				onChange={onChange}
			/>
			<FormField
				name='elevation'
				label='Elevation'
				isEditable={true}
				fullWidth
				options={{ suffix: 'feet' }}
				value={currentAdventure.elevation}
				onChange={onChange}
			/>
			<Accordion title={'Season Picker'}>
				<FormField
					name='season'
					label='Best Months'
					type='selectMany'
					options={{ selectMany: seasonOptions }}
					isEditable={true}
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
					isEditable={true}
					fullWidth
					value={currentAdventure.gear}
					onChange={onChange}
				/>
			</Accordion>
			<FormField
				name='gain'
				label='Elevation Gain'
				isEditable={true}
				fullWidth
				value={currentAdventure.gain}
				options={{ suffix: 'feet' }}
				onChange={onChange}
			/>
			<Accordion title={'Slope Angle'}>
				<FormField
					name='avg_angle'
					label='Average Slope Angle'
					isEditable={true}
					fullWidth
					value={currentAdventure.avg_angle}
					options={{ suffix: 'degrees' }}
					onChange={onChange}
				/>
				<FormField
					name='max_angle'
					label='Max Slope Angle'
					isEditable={true}
					fullWidth
					value={currentAdventure.max_angle}
					options={{ suffix: 'degrees' }}
					onChange={onChange}
				/>
			</Accordion>
			<FormField
				name='difficulty'
				label='Difficulty'
				type='range'
				options={{ range: rangeValues }}
				isEditable={true}
				fullWidth
				value={currentAdventure.difficulty}
				onChange={onChange}
			/>
			<FormField
				name='nearest_city'
				label='Nearest City'
				isEditable={true}
				fullWidth
				value={currentAdventure.nearest_city}
				onChange={onChange}
			/>
		</div>
	)
}

export default AdventureEditorForm
