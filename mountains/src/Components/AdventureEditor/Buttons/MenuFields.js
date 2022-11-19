import React from 'react'
import {
	useAdventureStateContext,
	useSaveActivity,
	useSaveTick,
	useUserStateContext
} from '../../../Providers'
import Menu from '../../Reusable/Menu'

const AdventureEditorMenu = () => {
	const { currentAdventure, isDeletePage, adventureDispatch, isAdventureEditable, saveState } =
		useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()
	const saveTick = useSaveTick()
	const saveActivity = useSaveActivity()

	if (!loggedInUser) return null

	const canAddTick = !loggedInUser?.ticks
		.map(({ adventure_id }) => adventure_id)
		.includes(currentAdventure?.id)

	const menuFields = []

	if (!currentAdventure && !isDeletePage) {
		menuFields.push({
			action: () => adventureDispatch({ type: 'toggleAdventureAddState' }),
			id: 'adventure-add-button',
			text: 'Add New Adventure'
		})
	} else if (currentAdventure && !isAdventureEditable && !isDeletePage && !saveState) {
		menuFields.push({
			action: () => adventureDispatch({ type: 'toggleAdventureEditable' }),
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

		if (!isDeletePage && currentAdventure.creator_id === loggedInUser.id) {
			menuFields.push({
				id: 'delete-adventure-button',
				className: 'delete-button',
				action: () => adventureDispatch({ type: 'toggleDeletePage' }),
				text: 'Delete Adventure'
			})
		}
	}

	if (!menuFields.length) return

	return <Menu fields={menuFields} />
}

export default AdventureEditorMenu
