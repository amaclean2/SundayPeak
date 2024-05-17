import PropTypes from 'prop-types'
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
import {
	climbTypeSelection,
	getClimbGrade,
	pitchClimbs,
	seasonOptions
} from 'Components/Adventures/utils'
import { LargeActivityIcon } from 'Images'

import DeletePage from './DeletePage'

const ClimbForm = () => {
	const { currentAdventure, isDeletePageOpen } = useAdventureStateContext()
	const { toggleDeletePage } = useDeleteAdventure()
	const { editAdventure } = useSaveAdventure()

	return (
		<DisplayCard title={currentAdventure.adventure_name}>
			<ErrorField form={'adventure'} />
			<FormField
				type='noedit'
				name='adventure_type'
				hideLabel
				value={
					<LargeActivityIcon
						type={'climb'}
						size={70}
					/>
				}
				isEditable
				onChange={() => {}}
			/>
			<FormField
				name={'adventure_name'}
				label={'Adventure Name'}
				isEditable
				value={currentAdventure.adventure_name}
				autoFocus
				onChange={editAdventure}
			/>
			<MultiField
				onChange={editAdventure}
				label={'Climb Info'}
				fields={[
					{
						type: 'select',
						name: 'climb_type',
						value: currentAdventure.climb_type || 'Trad',
						options: { selectOptions: climbTypeSelection }
					},
					{
						type: 'select',
						name: 'grade',
						value: currentAdventure.grade || 'Please select a climb type',
						options: { selectOptions: getClimbGrade({ climbType: currentAdventure.climb_type }) }
					}
				]}
			/>
			{pitchClimbs.includes(currentAdventure.climb_type) && (
				<FormField
					name='pitches'
					label={'Pitches'}
					isEditable
					fullWidth
					value={currentAdventure.pitches || ''}
					onChange={editAdventure}
				/>
			)}
			<FormField
				name='bio'
				label={getContent('adventurePanel.editable.description')}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.bio || ''}
				onChange={editAdventure}
			/>
			{pitchClimbs.includes(currentAdventure.climb_type) && (
				<FormField
					name='protection'
					label={'Protection'}
					type={'textarea'}
					isEditable
					fullWidth
					value={currentAdventure.protection || ''}
					onChange={editAdventure}
				/>
			)}
			<FormField
				name='approach'
				label={'Approach'}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.approach || ''}
				onChange={editAdventure}
			/>
			<FormField
				name='first_ascent'
				label={'First Ascent'}
				isEditable
				fullWidth
				value={currentAdventure.first_ascent || ''}
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
				className={'no-padding'}
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

ClimbForm.propTypes = {
	onChange: PropTypes.func
}

export default ClimbForm
