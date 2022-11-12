import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
	useAdventureEditContext,
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
		isEditable,
		setAdventureAddState,
		setIsEditable,
		saveState,
		setSaveState,
		currentBoundingBox,
		setIsDeletePage,
		isDeletePage
	} = useAdventureEditContext()
	const { saveNewAdventure, startAdventureSaveProcess } = useSaveAdventure()
	const { saveEditAdventure } = useSaveAdventure()
	const { getAllAdventures } = useGetAdventures()
	const { closeCard, setShowAlert, setAlertContent } = useCardStateContext()
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
						setAlertContent(`${currentAdventure.adventure_name} has been saved.`)
						setShowAlert(true)
					})
					.catch(console.error)
			} else {
				saveNewAdventure()
					.then(() => {
						getAllAdventures(currentBoundingBox)
						setSaveState(0)
						setAlertContent(`${currentAdventure.adventure_name} has been created.`)
						setShowAlert(true)
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

	const handleDeleteAdventure = async () => {
		setAlertContent(`${currentAdventure.adventure_name} has been deleted`)
		setShowAlert(true)
		await deleteAdventure({ adventureId: currentAdventure.id })
	}

	return (
		<FooterButtons>
			{!currentAdventure && !isDeletePage && (
				<Button
					onClick={() => setAdventureAddState(true)}
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
						onClick={() => setIsDeletePage(false)}
					>
						Cancel
					</Button>
				</>
			)}
			{currentAdventure && !isDeletePage && (isEditable || saveState === 1) && (
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
