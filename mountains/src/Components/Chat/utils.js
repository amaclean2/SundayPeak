import { useMessages, useMessagingStateContext } from '@amaclean2/sundaypeak-treewells'

export const useChatEditorMenu = () => {
	const { currentConversationId } = useMessagingStateContext()
	const buildEditorMenu = (openConversationModal) => {
		const menuFields = []

		if (!currentConversationId) {
			return null
		}

		menuFields.push({
			action: () => openConversationModal(),
			id: 'add-user-button',
			text: 'Add User'
		})

		return {
			fields: menuFields
		}
	}

	return {
		buildEditorMenu
	}
}
