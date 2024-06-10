import { useAdventureStateContext, useSaveAdventure } from '@amaclean2/sundaypeak-treewells'

import { Button, ErrorField, FormField, MultiField } from 'Components/Reusable'
import getContent from 'TextContent'
import { directionSelectOptions, seasonOptions } from 'Components/Adventures/utils'
import { LargeActivityIcon } from 'Images'

const SkiFields = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { editAdventure } = useSaveAdventure()

	return (
		<>
			<div className={'flex-box adventure-button-header'}>
				{menuContents.fields.map((button, idx) => (
					<Button
						key={`field_${idx}`}
						small
						className={button.id === 'delete-path' ? 'delete-button' : ''}
						onClick={button.action}
						id={button.id}
					>
						{button.text}
					</Button>
				))}
			</div>
			<ErrorField form={'adventure'} />
			<div className='flex-box edit-add-path'>
				<FormField
					type='noedit'
					name='adventure_type'
					minWidth={true}
					value={
						<LargeActivityIcon
							type={'ski'}
							size={70}
						/>
					}
					isEditable
					hideLabel
					onChange={() => {}}
				/>
			</div>
			<FormField
				name='adventure_name'
				label={'Adventure Name'}
				isEditable
				isLargeField
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
				name='season'
				label={getContent('adventurePanel.editable.bestMonths')}
				type='selectmany'
				options={{ selectMany: seasonOptions }}
				isEditable
				fullWidth
				value={currentAdventure.season || ''}
				onChange={editAdventure}
			/>
			<MultiField
				label={getContent('adventurePanel.editable.slope')}
				fields={[
					{
						type: 'text',
						name: 'avg_angle',
						value: currentAdventure.avg_angle || '',
						onChange: editAdventure,
						placeholder: getContent('adventurePanel.editable.avgAngle')
					},
					{
						type: 'text',
						name: 'max_angle',
						value: currentAdventure.max_angle || '',
						onChange: editAdventure,
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
		</>
	)
}

export default SkiFields
