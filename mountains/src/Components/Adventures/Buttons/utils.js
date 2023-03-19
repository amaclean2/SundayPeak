import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveCompletedAdventure,
	useSaveTodo,
	useUserStateContext
} from 'sundaypeak-treewells'

import getContent from 'TextContent'

export const useAdventureMenu = () => {
	const { loggedInUser } = useUserStateContext()
	const { currentAdventure } = useAdventureStateContext()
	const { shareAdventure } = useGetAdventures()
	const saveTodo = useSaveTodo()
	const saveCompletedAdventure = useSaveCompletedAdventure()

	const navigate = useNavigate()

	const buildAdventureMenu = () => {
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
					action: () =>
						saveCompletedAdventure({
							adventureId: currentAdventure.id,
							adventureType: currentAdventure.adventure_type
						}),
					id: 'adventure-complete-button',
					text: getContent('buttonText.completeActivity')
				})
			}
		}

		if (!fields.length) return null

		return { fields }
	}

	return buildAdventureMenu
}
