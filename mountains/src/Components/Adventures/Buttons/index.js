import getContent from 'TextContent'
import { Button, FooterButtons } from 'Components/Reusable'

const AdventureEditorButtons = () => {
	const { currentAdventure, isAdventureEditable, saveState, isDeletePage } =
		useAdventureStateContext()
	const { deleteAdventure, toggleDeletePage } = useDeleteAdventure()

	const handleDeleteAdventure = () => {
		deleteAdventure({
			adventureId: currentAdventure.id,
			adventureType: currentAdventure.adventure_type,
			adventureName: currentAdventure.adventure_name
		})
	}

	if (currentAdventure && !isDeletePage && !isAdventureEditable && !saveState) {
		return null
	}

	const addButtonContainerClass = !currentAdventure && !isDeletePage ? 'add-button-container' : ''

	return (
		<FooterButtons className={addButtonContainerClass}>
			{isDeletePage && (
				<>
					<Button
						id={`confirm-button-delete-adventure`}
						className={'delete-button'}
						onClick={handleDeleteAdventure}
					>
						{getContent('buttonText.deleteAdventureVar', [currentAdventure.adventure_name])}
					</Button>
					<Button
						id={`cancel-button-return-from-delete`}
						onClick={toggleDeletePage}
					>
						{getContent('buttonText.cancel')}
					</Button>
				</>
			)}
		</FooterButtons>
	)
}

export default AdventureEditorButtons
