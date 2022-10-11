import React from 'react'
import {
	useAdventureEditContext,
	useSaveActivity,
	useSaveTick,
	useUserStateContext
} from '../../../Providers'
import Menu from '../../Reusable/Menu'

const AdventureEditorMenu = () => {
	const {
		currentAdventure,
		isDelete,
		setIsDelete,
		setAdventureAddState,
		isEditable,
		setIsEditable,
		saveState
	} = useAdventureEditContext()
	const { loggedInUser } = useUserStateContext()
	const { saveTick } = useSaveTick()
	const { saveActivity } = useSaveActivity()

	const canAddTick = !loggedInUser.ticks
		.map(({ adventure_id }) => adventure_id)
		.includes(currentAdventure?.id)

	const menuFields = []

	if (!currentAdventure && !isDelete) {
		menuFields.push({
			action: () => setAdventureAddState(true),
			id: 'adventure-add-button',
			text: 'Add New Adventure'
		})
	} else if (currentAdventure && !isEditable && !isDelete && saveState === 0) {
		menuFields.push({
			action: () => setIsEditable(true),
			id: 'adventure-edit-button',
			text: 'Edit Adventure'
		})

		if (canAddTick) {
			menuFields.push({
				id: 'adventure-tick-button',
				action: () => saveTick({ adventureId: currentAdventure.id }),
				text: 'Add to Ticklist'
			})
		}

		menuFields.push({
			id: 'adventure-complete-button',
			action: () => saveActivity({ adventureId: currentAdventure.id }),
			text: 'Complete Activity'
		})

		if (!isDelete) {
			menuFields.push({
				id: 'delete-adventure-button',
				className: 'delete-button',
				action: () => setIsDelete(true),
				text: 'Delete Adventure'
			})
		}
	}

	if (!menuFields.length) return

	return <Menu fields={menuFields} />
}

export default AdventureEditorMenu
