import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveAdventure,
	useSaveTodo,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import getContent from 'TextContent'

export const useAdventureMenu = () => {
	const { loggedInUser } = useUserStateContext()
	const { currentAdventure } = useAdventureStateContext()
	const { shareAdventure } = useGetAdventures()
	const { saveTodo } = useSaveTodo()
	const { togglePathEdit, deletePath, toggleAdventureAddState } = useSaveAdventure()

	const navigate = useNavigate()

	const buildAdventureMenu = (setIsCompleteMenuOpen) => {
		if (!loggedInUser) return null

		const canAddTodo =
			!loggedInUser?.todo_adventures
				?.map(({ adventure_id }) => adventure_id)
				.includes(currentAdventure?.id) &&
			!loggedInUser?.completed_adventures
				?.map(({ adventure_id }) => adventure_id)
				.includes(currentAdventure?.id)

		const canComplete = !loggedInUser?.completed_adventures
			?.map(({ adventure_id }) => adventure_id)
			.includes(currentAdventure?.id)

		const fields = []

		if (currentAdventure) {
			fields.push({
				action: () => shareAdventure({ id: currentAdventure.id }),
				id: 'adventure-share-button',
				text: getContent('buttonText.share')
			})

			fields.push({
				action: () =>
					navigate(`/adventure/edit/${currentAdventure.adventure_type}/${currentAdventure.id}`),
				id: 'adventure-edit-button',
				text: getContent('buttonText.editAdventure')
			})

			fields.push({
				action: 'export',
				id: 'adventure-download-button',
				text: 'Export Adventure'
			})

			if (canAddTodo) {
				fields.push({
					action: () =>
						saveTodo({
							adventureId: currentAdventure.id,
							adventureType: currentAdventure.adventure_type
						}),
					id: 'adventure-tick-button',
					text: getContent('buttonText.addToTicklist')
				})
			}

			if (canComplete) {
				fields.push({
					action: () => {
						setIsCompleteMenuOpen(true)
					},
					// saveCompletedAdventure({
					// 	adventureId: currentAdventure.id,
					// 	adventureType: currentAdventure.adventure_type
					// }),
					id: 'adventure-complete-button',
					text: getContent('buttonText.completeActivity')
				})
			}
		}

		if (!fields.length) return null

		return { fields }
	}

	const buildEditViewMenu = () => {
		const fields = []

		if (currentAdventure.path?.length) {
			fields.push({
				action: deletePath,
				id: 'delete-path',
				text: 'Delete Path'
			})
			fields.push({
				action: () => togglePathEdit(true),
				id: 'edit-path',
				text: 'Edit Path'
			})
		} else {
			fields.push({
				action: () => togglePathEdit(true),
				id: 'add-path',
				text: 'Add Path'
			})
		}
		fields.push({
			action: toggleAdventureAddState,
			id: 'move-marker',
			text: 'Move Marker'
		})

		return { fields }
	}

	return {
		buildAdventureMenu,
		buildEditViewMenu
	}
}
