import { Accordion, ErrorField, FormField, MultiField } from 'Components/Reusable'
import { useAdventureStateContext } from 'Providers'
import getContent from 'TextContent'
import { seasonOptions } from 'Components/AdventureEditor/utils'
import { LargeHikerIcon } from 'Images'

const HikeForm = ({ onChange }) => {
	const { currentAdventure } = useAdventureStateContext()

	/**
	 * id INT AUTO_INCREMENT,
    difficulty INT,
    elevation INT,
    distance FLOAT,
    season VARCHAR(100),
    gain INT,
    PRIMARY KEY(id)
	 */

	return (
		<div className='adventure-info flex-box'>
			<ErrorField form={'adventure'} />
			<FormField
				type='noedit'
				name='adventure_type'
				value={
					<LargeHikerIcon
						size={70}
						className={'editor-hiker'}
					/>
				}
				isEditable
				hideLabel
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
				name='distance'
				label={'Distance'}
				isEditable
				fullWidth
				options={{ suffix: 'miles' }}
				value={currentAdventure.distance || ''}
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
