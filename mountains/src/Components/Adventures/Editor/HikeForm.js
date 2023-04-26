import { useAdventureStateContext } from '@amaclean2/sundaypeak-treewells'

import {
	Button,
	DisplayCard,
	ErrorField,
	FooterButtons,
	FormField,
	MultiField
} from 'Components/Reusable'
import getContent from 'TextContent'
import { seasonOptions } from 'Components/Adventures/utils'
import { LargeHikerIcon } from 'Images'

const HikeForm = ({ onChange }) => {
	const { currentAdventure } = useAdventureStateContext()

	return (
		<DisplayCard title={currentAdventure.adventure_name}>
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
				name={'adventure_name'}
				label={'Adventure Name'}
				isEditable
				value={currentAdventure.adventure_name}
				autoFocus
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
						name: 'summit_elevation',
						value: currentAdventure.summit_elevation || '',
						placeholder: getContent('adventurePanel.editable.summit')
					},
					{
						type: 'text',
						name: 'base_elevation',
						value: currentAdventure.base_elevation || '',
						placeholder: 'Base Elevation'
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
			</FooterButtons>
		</DisplayCard>
	)
}

export default HikeForm
