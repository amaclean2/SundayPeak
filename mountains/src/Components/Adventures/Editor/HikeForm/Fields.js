import { useAdventureStateContext, useSaveAdventure } from '@amaclean2/sundaypeak-treewells'
import { seasonOptions } from 'Components/Adventures/utils'
import { Button, ErrorField, FormField } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'
import getContent from 'TextContent'
import React from 'react'

const HikeFields = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { editAdventure } = useSaveAdventure()

	console.log({ menuContents })

	return (
		<>
			<div className={'flex-box adventure-button-header'}>
				{menuContents.fields.map((button, idx) => (
					<Button
						small
						key={`path_button_${idx}`}
						className={button.id === 'delete-path' && 'delete-button'}
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
							type={'hike'}
							size={70}
						/>
					}
					isEditable
					hideLabel
					onChange={() => {}}
				/>
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
						editAdventure({
							target: { name: 'difficulty', value: `${event.target.value}:1` }
						})
					}
				/>
			)}
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
				className={'no-padding'}
				isEditable
				fullWidth
				value={
					![undefined, null].includes(currentAdventure.public) ? currentAdventure.public : true
				}
				onChange={editAdventure}
			/>
		</>
	)
}

export default HikeFields
