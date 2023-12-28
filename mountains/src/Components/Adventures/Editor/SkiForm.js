import {
	useAdventureStateContext,
	useDeleteAdventure,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

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
import CheckboxField from 'Components/Reusable/FormField/CheckboxField'

const SkiForm = () => {
	const { currentAdventure, isDeletePageOpen, isPathEditOn, matchPath } = useAdventureStateContext()
	const { toggleDeletePage } = useDeleteAdventure()
	const { editAdventure, togglePathEdit, savePath, deletePath, toggleMatchPath } =
		useSaveAdventure()

	return (
		<DisplayCard title={currentAdventure.adventure_name || 'New Adventure'}>
			<ErrorField form={'adventure'} />
			<div className='flex-box edit-add-path'>
				<FormField
					type='noedit'
					name='adventure_type'
					minWidth={true}
					value={
						<LargeSkierIcon
							size={70}
							className={'editor-skier'}
						/>
					}
					isEditable
					hideLabel
					onChange={() => {}}
				/>
				<div className='flex-box path-buttons'>
					{isPathEditOn && (
						<FormField
							name='pathMatch'
							label={'Match path to a given road or trail'}
							type={'checkbox'}
							isEditable
							fullWidth
							reverse
							className='no-padding'
							value={matchPath}
							onChange={toggleMatchPath}
						/>
					)}
					{!currentAdventure.path?.length && (
						<Button
							small
							id={'path-add-button'}
							onClick={() => {
								if (isPathEditOn) {
									savePath()
								} else {
									togglePathEdit()
								}
							}}
						>
							{isPathEditOn ? 'Finish Adding Line' : 'Add Line'}
						</Button>
					)}
					{!isPathEditOn && !!currentAdventure.path?.length && (
						<Button onClick={deletePath}>Delete Line</Button>
					)}
				</div>
			</div>
			<FormField
				name='adventure_name'
				label={'Adventure Name'}
				isEditable
				fullWidth
				value={currentAdventure.adventure_name || ''}
				autoFocus={true}
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
				label={getContent('adventurePanel.editable.approachDistance')}
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
				onChange={editAdventure}
			/>
			<FormField
				name='gear'
				label={getContent('adventurePanel.editable.gearRequired')}
				type='selectmany'
				options={{ selectMany: gearOptions }}
				isEditable
				fullWidth
				value={currentAdventure.gear || ''}
				onChange={editAdventure}
			/>
			<MultiField
				onChange={editAdventure}
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
				onChange={editAdventure}
			/>
			{Number(currentAdventure.difficulty.split(':')[1]) <= 1 && (
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
					value={Number(currentAdventure.difficulty.split(':')[0]) || 1}
					onChange={(event) =>
						editAdventure({ target: { name: 'difficulty', value: `${event.target.value}:1` } })
					}
				/>
			)}
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
				className={'no-padding'}
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

export default SkiForm
