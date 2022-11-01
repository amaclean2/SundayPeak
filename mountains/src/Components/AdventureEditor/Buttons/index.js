import { useState } from 'react'

import {
	useAdventureEditContext,
	useCardStateContext,
	useDeleteAdventure,
	useEditAdventure,
	useGetAdventures,
	useSaveAdventure
} from '../../../Providers'
import { Button, FooterButtons } from '../../Reusable'

const AdventureEditorButtons = () => {
	const {
		currentAdventure,
		adventureAddState,
		isEditable,
		setAdventureAddState,
		setIsEditable,
		saveState,
		setSaveState,
		currentBoundingBox,
		setIsDelete,
		isDelete
	} = useAdventureEditContext()
	const { saveNewAdventure, startAdventureSaveProcess } = useSaveAdventure()
	const { saveEditAdventure } = useEditAdventure()
	const { getAllAdventures } = useGetAdventures()
	const { closeCard } = useCardStateContext()
	const { deleteAdventure } = useDeleteAdventure()

	const saveAdventure = async () => {
		if (saveState === 0) {
			const { error: saveAdventureError } = await startAdventureSaveProcess()

			if (!saveAdventureError) {
				setSaveState(1)
			}
		} else if (saveState === 1) {
			if (currentAdventure.id && currentAdventure.id !== 'waiting') {
				saveEditAdventure()
					.then(() => {
						getAllAdventures(currentBoundingBox)
						setSaveState(0)
					})
					.catch(console.error)
			} else {
				saveNewAdventure()
					.then(() => {
						getAllAdventures(currentBoundingBox)
						setSaveState(0)
					})
					.catch(console.error)
			}
		}
	}

	const cancelSave = () => {
		getAllAdventures(currentBoundingBox)
		setSaveState(0)
		setIsEditable(false)
		if (!currentAdventure.id || currentAdventure.id === 'waiting') {
			closeCard()
		}
	}

	const handleToggleEdit = () => {
		setIsEditable(!isEditable)
		setSaveState(saveState === 0 ? 1 : 0)
	}

	const handleDeleteAdventure = () => {
		deleteAdventure({ adventureId: currentAdventure.id })
	}

	return (
		<FooterButtons>
			{!currentAdventure && !isDelete && (
				<Button
					onClick={() => setAdventureAddState(true)}
					disabled={adventureAddState}
					className='adventure-add-button'
				>
					Add New Adventure
				</Button>
			)}
			{isDelete && (
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
						onClick={() => setIsDelete(false)}
					>
						Cancel
					</Button>
				</>
			)}
			{currentAdventure && !isDelete && (isEditable || saveState === 1) && (
				<>
					<Button
						onClick={saveAdventure}
						className='adventure-edit-button'
					>
						{saveState === 0 ? 'Preview Save' : 'Finish Saving'}
					</Button>
					{saveState === 1 && (
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
