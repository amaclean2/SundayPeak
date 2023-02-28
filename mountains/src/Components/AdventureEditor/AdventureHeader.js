import { FieldHeader, FlexSpacer, HeaderSubtext, ProfileHeader } from 'Components/Reusable'
import { useAdventureStateContext } from 'Providers'
import getContent from 'TextContent'
import AdventureEditorMenu from './Buttons/MenuFields'

const AdventureHeader = ({ onChange }) => {
	const { currentAdventure, isAdventureEditable } = useAdventureStateContext()

	if (currentAdventure) {
		if (isAdventureEditable) {
			// editor
			return (
				<ProfileHeader
					textContents={currentAdventure.adventure_name}
					className={'edit-adventure-header'}
					editFields={{
						isEditable: isAdventureEditable,
						propName: 'adventure_name',
						placeholder: 'New Adventure',
						onChange
					}}
				/>
			)
		} else {
			// adventure viewer
			return (
				<ProfileHeader
					className={'adventure-profile-header'}
					locked
				>
					<div>
						<FieldHeader
							pageHeader
							text={currentAdventure.adventure_name}
						/>
						{currentAdventure.nearest_city?.length && (
							<HeaderSubtext>{currentAdventure.nearest_city}</HeaderSubtext>
						)}
					</div>
					<FlexSpacer />
					<AdventureEditorMenu />
				</ProfileHeader>
			)
		}
	} else {
		// main adventure page
		return (
			<ProfileHeader slim>
				<FieldHeader
					pageHeader
					text={getContent('adventurePanel.adventureCreator')}
				/>
			</ProfileHeader>
		)
	}
}

export default AdventureHeader
