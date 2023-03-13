import PropTypes from 'prop-types'

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
import { LargeClimberIcon } from 'Images'
import { Link } from 'react-router-dom'
import DeletePage from './DeletePage'
import { useAdventureStateContext } from 'Hooks/Providers'

const ClimbForm = ({ onChange }) => {
	const { currentAdventure, adventureDispatch, isDeletePage } = useAdventureStateContext()

	return (
		<DisplayCard title={currentAdventure.adventure_name}>
			<ErrorField form={'adventure'} />
			<FormField
				type='noedit'
				name='adventure_type'
				hideLabel
				value={
					<LargeClimberIcon
						size={70}
						className={'editor-climber'}
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
				onChange={onChange}
			/>
			<MultiField
				onChange={onChange}
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
					onChange={onChange}
				/>
			)}
			<FormField
				name='bio'
				label={getContent('adventurePanel.editable.description')}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.bio || ''}
				onChange={onChange}
			/>
			{pitchClimbs.includes(currentAdventure.climb_type) && (
				<FormField
					name='protection'
					label={'Protection'}
					type={'textarea'}
					isEditable
					fullWidth
					value={currentAdventure.protection || ''}
					onChange={onChange}
				/>
			)}
			<FormField
				name='approach'
				label={'Approach'}
				type='textarea'
				isEditable
				fullWidth
				value={currentAdventure.approach || ''}
				onChange={onChange}
			/>
			<FormField
				name='first_ascent'
				label={'First Ascent'}
				isEditable
				fullWidth
				value={currentAdventure.first_ascent || ''}
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
				<Link
					className={'button flex-box'}
					to={`/adventure/${currentAdventure.adventure_type}/${currentAdventure.id}`}
				>
					Finish
				</Link>
				<Button
					className={'delete-button'}
					id={'adventure-delete-button'}
					onClick={() => adventureDispatch({ type: 'toggleDeletePage' })}
				>
					Delete
				</Button>
			</FooterButtons>
			{isDeletePage && <DeletePage />}
		</DisplayCard>
	)
}

ClimbForm.propTypes = {
	onChange: PropTypes.func
}

export default ClimbForm
