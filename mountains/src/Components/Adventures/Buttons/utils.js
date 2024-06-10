import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveAdventure,
	useSaveTodo,
	useUserStateContext,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'

import getContent from 'TextContent'

export const useAdventureMenu = () => {
	const { loggedInUser } = useUserStateContext()
	const { currentAdventure } = useAdventureStateContext()
	const { currentZone } = useZoneStateContext()
	const { shareAdventure } = useGetAdventures()
	const { saveTodo } = useSaveTodo()
	const { togglePathEdit, deletePath, toggleAdventureAddState, removeAdventureFromArea } =
		useSaveAdventure()

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
				viewerItem: false,
				id: 'adventure-share-button',
				text: getContent('buttonText.share')
			})

			fields.push({
				action: () =>
					navigate(`/adventure/edit/${currentAdventure.adventure_type}/${currentAdventure.id}`),
				viewerItem: false,
				id: 'adventure-edit-button',
				text: getContent('buttonText.editAdventure')
			})

			fields.push({
				action: 'export',
				viewerItem: false,
				id: 'adventure-download-button',
				text: 'Export Adventure'
			})

			if (currentAdventure.breadcrumb?.length > 1) {
				fields.push({
					action: () =>
						removeAdventureFromArea({
							parentId: currentAdventure.breadcrumb[currentAdventure.breadcrumb.length - 2].id,
							childId: currentAdventure.id
						}),
					viewerItem: false,
					id: 'remove-zone-button',
					text: 'Remove Adventure from Area'
				})
			}

			if (canAddTodo) {
				fields.push({
					action: () =>
						saveTodo({
							adventureId: currentAdventure.id,
							adventureType: currentAdventure.adventure_type
						}),
					viewerItem: true,
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
					viewerItem: true,
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
			action: () => toggleAdventureAddState('adventure'),
			id: 'move-marker',
			text: 'Move Marker'
		})
		// fields.push({
		// 	action: () => console.log('Hi'),
		// 	id: 'add-adventure-to-zone',
		// 	text: 'Add to Zone'
		// })

		return { fields }
	}

	const buildZoneMenu = () => {
		const fields = []

		if (!loggedInUser) return null

		const canEdit = loggedInUser.id === currentZone.creator_id

		if (currentZone) {
			// yes, but not ready yet
			// fields.push({
			// 	action: () => shareAdventure({ id: currentAdventure.id }),
			// 	viewerItem: false,
			// 	id: 'adventure-share-button',
			// 	text: getContent('buttonText.share')
			// })
			if (canEdit) {
				fields.push({
					action: () => navigate(`/zone/edit/${currentZone.id}`),
					viewerItem: false,
					id: 'zone-edit-button',
					text: 'Edit Area'
				})
				fields.push({
					action: () => navigate(`/zone/edit/${currentZone.id}/adventureFinder`),
					viewerItem: false,
					id: 'adventure-add-button',
					text: 'Add Adventure to Area'
				})
				fields.push({
					action: () => navigate(`/zone/edit/${currentZone.id}/zoneFinder`),
					viewerItem: false,
					id: 'zone-add-button',
					text: 'Add Child Area'
				})
			}
		}

		if (!fields.length) return null

		return { fields }
	}

	return {
		buildAdventureMenu,
		buildEditViewMenu,
		buildZoneMenu
	}
}
