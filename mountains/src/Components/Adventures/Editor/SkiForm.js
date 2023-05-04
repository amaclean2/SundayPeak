import { useAdventureStateContext, useDeleteAdventure } from '@amaclean2/sundaypeak-treewells'

import {
	Button,
	DisplayCard,
	ErrorField,
	FooterButtons,
	FormField,
	MultiField
} from 'Components/Reusable'
import getContent from 'TextContent'
import { directionSelectOptions, gearOptions, seasonOptions } from 'Components/Adventures/utils'
import { LargeSkierIcon } from 'Images'
import DeletePage from './DeletePage'

const SkiForm = ({ onChange }) => {
	const { currentAdventure, isDeletePageOpen } = useAdventureStateContext()
	const { toggleDeletePage } = useDeleteAdventure()

	return (
		<DisplayCard title={currentAdventure.adventure_name || 'New Adventure'}>
			<ErrorField form={'adventure'} />
			<FormField
				type='noedit'
				name='adventure_type'
				hideLabel
				value={
					<LargeSkierIcon
						size={40}
						className={'editor-skier'}
					/>
				}
				isEditable
				onChange={() => {}}
			/>
			<FormField
				name='adventure_name'
				label={'Adventure Name'}
				isEditable
				fullWidth
				value={currentAdventure.adventure_name || ''}
				autoFocus={true}
				onChange={onChange}
			/>
			<FormField
				name='bio'
				label={getContent('adventurePanel.editable.description')}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.bio || ''}
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
						name: 'summit_elevation',
						value: currentAdventure.summit_elevation || '',
						placeholder: getContent('adventurePanel.editable.summit')
					},
					{
						type: 'text',
						name: 'base_elevation',
						value: currentAdventure.base_elevation || '',
						placeholder: getContent('adventurePanel.editable.base')
					}
				]}
			/>
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
			<MultiField
				onChange={onChange}
				label={getContent('adventurePanel.editable.slope')}
				fields={[
					{
						type: 'text',
						name: 'avg_angle',
						value: currentAdventure.avg_angle || '',
						placeholder: getContent('adventurePanel.editable.avgAngle')
					},
					{
						type: 'text',
						name: 'max_angle',
						value: currentAdventure.max_angle || '',
						placeholder: getContent('adventurePanel.editable.maxAngle')
					}
				]}
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
			<FormField
				name='difficulty'
				label={getContent('adventurePanel.fields.difficulty')}
				type='range'
				options={{
					range: {
						min: 1,
						max: 5,
						step: 1
					}
				}}
				isEditable
				fullWidth
				value={currentAdventure.difficulty || 1}
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
				value={
					![undefined, null].includes(currentAdventure.public) ? currentAdventure.public : true
				}
				onChange={onChange}
			/>
			<FooterButtons>
				<Button direction={`/adventure/${currentAdventure.adventure_type}/${currentAdventure.id}`}>
					Finish
				</Button>
				<Button
					className={'delete-button'}
					id={'adventure-delete-button'}
					onClick={toggleDeletePage}
				>
					Delete Adventure
				</Button>
			</FooterButtons>
			{isDeletePageOpen && <DeletePage />}
		</DisplayCard>
	)
}

export default SkiForm
