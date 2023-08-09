import {
	useAdventureStateContext,
	useDeleteAdventure,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

import {
	Button,
	DisplayCard,
	ErrorField,
	FlexSpacer,
	FooterButtons,
	FormField,
	MultiField
} from 'Components/Reusable'
import getContent from 'TextContent'
import { seasonOptions } from 'Components/Adventures/utils'
import { LargeHikerIcon } from 'Images'
import DeletePage from './DeletePage'

const HikeForm = () => {
	const { currentAdventure, isDeletePageOpen, isPathEditOn } = useAdventureStateContext()
	const { toggleDeletePage } = useDeleteAdventure()
	const { editAdventure, togglePathEdit, savePath, deletePath } = useSaveAdventure()

	return (
		<DisplayCard title={currentAdventure.adventure_name}>
			<ErrorField form={'adventure'} />
			<div className='flex-box edit-add-path'>
				<FormField
					type='noedit'
					name='adventure_type'
					minWidth={true}
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
				<Button
					id={'path-add-button'}
					onClick={() => {
						if (isPathEditOn) {
							savePath()
						} else {
							togglePathEdit()
						}
					}}
				>
					{isPathEditOn ? 'Finish Adding Path' : 'Add Path'}
				</Button>
				{!isPathEditOn && currentAdventure.path && (
					<Button onClick={deletePath}>Delete Path</Button>
				)}
			</div>
			<FormField
				name={'adventure_name'}
				label={'Adventure Name'}
				isEditable
				value={currentAdventure.adventure_name}
				autoFocus
				onChange={editAdventure}
			/>
			<FormField
				name='bio'
				label={getContent('adventurePanel.editable.description')}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.bio || ''}
				onChange={editAdventure}
			/>
			<FormField
				name='distance'
				label={'Distance'}
				isEditable
				fullWidth
				options={{ suffix: 'miles' }}
				value={currentAdventure.distance || ''}
				onChange={editAdventure}
			/>
			<MultiField
				onChange={editAdventure}
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
						max: 5,
						step: 1
					}
				}}
				isEditable
				fullWidth
				value={currentAdventure.difficulty || 1}
				onChange={editAdventure}
			/>
			<FormField
				name='season'
				label={getContent('adventurePanel.editable.bestMonths')}
				type='selectmany'
				options={{ selectMany: seasonOptions }}
				isEditable
				fullWidth
				value={currentAdventure.season || ''}
				onChange={editAdventure}
			/>
			<FormField
				name='nearest_city'
				label={getContent('adventurePanel.editable.nearest')}
				isEditable
				fullWidth
				value={currentAdventure.nearest_city || ''}
				onChange={editAdventure}
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
				onChange={editAdventure}
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

export default HikeForm
