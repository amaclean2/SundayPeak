import { useAdventureStateContext, useSaveAdventure } from '@amaclean2/sundaypeak-treewells'
import { gearOptions } from 'Components/Adventures/utils'
import { Button, ErrorField, FormField } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'
import getContent from 'TextContent'
import React from 'react'

const SkiApproachFields = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { editAdventure } = useSaveAdventure()
	return (
		<>
			<div className={'flex-box adventure-button-header'}>
				{menuContents.fields.map((button, idx) => (
					<Button
						small
						key={`path_button_${idx}`}
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
							size={70}
							type={'ski'}
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
				name='gear'
				label={getContent('adventurePanel.editable.gearRequired')}
				type='selectmany'
				options={{ selectMany: gearOptions }}
				isEditable
				fullWidth
				value={currentAdventure.gear || ''}
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

export default SkiApproachFields
