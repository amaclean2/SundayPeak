import {
	useAdventureStateContext,
	useCardStateContext,
	useDeleteAdventure,
	useSaveAdventure,
	useGetAdventures
} from '../../../Providers'
import { Button, FooterButtons } from '../../Reusable'

const AdventureEditorButtons = () => {
	const {
		currentAdventure,
		adventureAddState,
		isAdventureEditable,
		adventureDispatch,
		saveState,
		currentBoundingBox,
		isDeletePage
	} = useAdventureStateContext()
	const { saveNewAdventure, startAdventureSaveProcess } = useSaveAdventure()
	const { saveEditAdventure } = useSaveAdventure()
	const { getAllAdventures } = useGetAdventures()
	const { cardDispatch } = useCardStateContext()
	const deleteAdventure = useDeleteAdventure()

	const saveAdventure = async () => {
		if (!saveState) {
			const { error: saveAdventureError } = await startAdventureSaveProcess()

			if (!saveAdventureError) {
				adventureDispatch({ type: 'toggleSaveState' })
			}
		} else {
			if (currentAdventure.id && currentAdventure.id !== 'waiting') {
				saveEditAdventure()
					.then(() => {
						getAllAdventures(currentBoundingBox)
						adventureDispatch({ type: 'toggleSaveState' })
						cardDispatch({
							type: 'openAlert',
							payload: `${currentAdventure.adventure_name} has been saved.`
						})
					})
					.catch(console.error)
			} else {
				saveNewAdventure()
					.then(() => {
						getAllAdventures(currentBoundingBox)
						adventureDispatch({ type: 'toggleSaveState' })
						cardDispatch({
							type: 'openAlert',
							payload: `${currentAdventure.adventure_name} has been created.`
						})
					})
					.catch(console.error)
			}
		}
	}

	const cancelSave = () => {
		getAllAdventures(currentBoundingBox)
		adventureDispatch({ type: 'toggleEdit' })
		if (!currentAdventure.id || currentAdventure.id === 'waiting') {
			cardDispatch({ type: 'closeCard' })
		}
	}

	const handleToggleEdit = () => {
		adventureDispatch({ type: 'toggleEdit' })
	}

	const handleDeleteAdventure = async () => {
		cardDispatch({
			type: 'openAlert',
			payload: `${currentAdventure.adventure_name} has been deleted`
		})
		await deleteAdventure({ adventureId: currentAdventure.id })
	}

	return (
		<FooterButtons>
			{!currentAdventure && !isDeletePage && (
				<Button
					onClick={() => adventureDispatch({ type: 'toggleAdventureAddState' })}
					disabled={adventureAddState}
					className='adventure-add-button'
				>
					Add New Adventure
				</Button>
			)}
			{isDeletePage && (
				<>
					<Button
						id={`confirm-button-delete-adventure`}
						className={'delete-button'}
						onClick={handleDeleteAdventure}
					>
						{`Delete ${currentAdventure.adventure_name}`}
					</Button>
					<Button
						id={`cancel-button-return-from-delete`}
						onClick={() => adventureDispatch({ type: 'toggleDeletePage' })}
					>
						Cancel
					</Button>
				</>
			)}
			{currentAdventure && !isDeletePage && (isAdventureEditable || saveState) && (
				<>
					<Button
						onClick={saveAdventure}
						className='adventure-edit-button'
					>
						{!saveState ? 'Preview Save' : 'Finish Saving'}
					</Button>
					{saveState && (
						<Button
							onClick={handleToggleEdit}
							className='adventure-edit-button'
							id='adventure-edit-button'
						>
							Edit Adventure
						</Button>
					)}
					<Button
						onClick={cancelSave}
						className='adventure-edit-button'
					>
						Cancel
					</Button>
				</>
			)}
		</FooterButtons>
	)
}

export default AdventureEditorButtons
