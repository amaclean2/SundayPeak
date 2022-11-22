import {
	useAdventureStateContext,
	useCardStateContext,
	useDeleteAdventure,
	useSaveAdventure,
	useGetAdventures,
	useGetAdventure
} from '../../../Providers'
import getContent from '../../../TextContent'
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
	const getAdventure = useGetAdventure()
	const { cardDispatch, screenType } = useCardStateContext()
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
							payload: getContent('adventurePanel.adventureSaved', [
								currentAdventure.adventure_name
							])
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
							payload: getContent('adventurePanel.adventureCreated', [
								currentAdventure.adventure_name
							])
						})
					})
					.catch(console.error)
			}
		}
	}

	const cancelSave = () => {
		adventureDispatch({ type: 'exitEdit' })
		getAdventure({ id: currentAdventure.id })
		if (!currentAdventure.id || currentAdventure.id === 'waiting') {
			cardDispatch({ type: 'closeCard' })
			getAllAdventures(currentBoundingBox)
		}
	}

	const handleToggleEdit = () => {
		adventureDispatch({ type: 'toggleEdit' })
	}

	const handleDeleteAdventure = async () => {
		cardDispatch({
			type: 'openAlert',
			payload: getContent('adventurePanel.adventureDeleted', [currentAdventure.adventure_name])
		})
		await deleteAdventure({ adventureId: currentAdventure.id })
	}

	const handleAddAdventure = () => {
		adventureDispatch({ type: 'toggleAdventureAddState' })
		if (screenType.mobile) {
			cardDispatch({ type: 'closeCard' })
		}
	}

	return (
		<FooterButtons>
			{!currentAdventure && !isDeletePage && (
				<Button
					onClick={handleAddAdventure}
					disabled={adventureAddState}
					className='adventure-add-button'
				>
					{getContent('buttonText.addAdventure')}
				</Button>
			)}
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
						onClick={() => adventureDispatch({ type: 'toggleDeletePage' })}
					>
						{getContent('buttonText.cancel')}
					</Button>
				</>
			)}
			{currentAdventure && !isDeletePage && (isAdventureEditable || saveState) && (
				<>
					<Button
						onClick={saveAdventure}
						className='adventure-edit-button'
					>
						{!saveState
							? getContent('buttonText.previewSave')
							: getContent('buttonText.finishSave')}
					</Button>
					{saveState && (
						<Button
							onClick={handleToggleEdit}
							className='adventure-edit-button'
							id='adventure-edit-button'
						>
							{getContent('buttonText.editAdventure')}
						</Button>
					)}
					<Button
						onClick={cancelSave}
						className='adventure-edit-button'
					>
						{getContent('buttonText.cancel')}
					</Button>
				</>
			)}
		</FooterButtons>
	)
}

export default AdventureEditorButtons
