import React from 'react'
import {
	useAdventureStateContext,
	useGetAdventure,
	useSaveActivity,
	useSaveTick,
	useUserStateContext
} from '../../../Providers'
import getContent from '../../../TextContent'
import Menu from '../../Reusable/Menu'

const AdventureEditorMenu = () => {
	const { adventureDispatch, currentAdventure, isDeletePage, isAdventureEditable, saveState } =
		useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()
	const saveTick = useSaveTick()
	const saveActivity = useSaveActivity()
	const { shareAdventure } = useGetAdventure()

	if (!loggedInUser) return null

	const canAddTick =
		!loggedInUser?.ticks.map(({ adventure_id }) => adventure_id).includes(currentAdventure?.id) &&
		!loggedInUser?.activities.map(({ adventure_id }) => adventure_id).includes(currentAdventure?.id)

	const canComplete = !loggedInUser?.activities
		.map(({ adventure_id }) => adventure_id)
		.includes(currentAdventure?.id)

	const menuFields = []

	if (!currentAdventure && !isDeletePage) {
		menuFields.push({
			action: () => adventureDispatch({ type: 'toggleAdventureAddState' }),
			id: 'adventure-add-button',
			text: getContent('buttonText.addAdventure')
		})
	} else if (currentAdventure && !isAdventureEditable && !isDeletePage && !saveState) {
		menuFields.push({
			action: () => shareAdventure({ id: currentAdventure.id }),
			id: 'adventure-share-button',
			text: getContent('buttonText.share')
		})

		menuFields.push({
			action: () => adventureDispatch({ type: 'toggleAdventureEditable' }),
			id: 'adventure-edit-button',
			text: getContent('buttonText.editAdventure')
		})

		if (canAddTick) {
			menuFields.push({
				id: 'adventure-tick-button',
				action: () => saveTick({ adventureId: currentAdventure.id }),
				text: getContent('buttonText.addToTicklist')
			})
		}

		if (canComplete) {
			menuFields.push({
				id: 'adventure-complete-button',
				action: () => saveActivity({ adventureId: currentAdventure.id }),
				text: getContent('buttonText.completeActivity')
			})
		}

		if (!isDeletePage && currentAdventure.creator_id === loggedInUser.id) {
			menuFields.push({
				id: 'delete-adventure-button',
				className: 'delete-button',
				action: () => adventureDispatch({ type: 'toggleDeletePage' }),
				text: getContent('buttonText.deleteAdventure')
			})
		}
	}

	if (!menuFields.length) return null

	return <Menu fields={menuFields} />
}

export default AdventureEditorMenu
