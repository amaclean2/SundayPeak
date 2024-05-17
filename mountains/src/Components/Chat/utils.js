import {
	useMessages,
	useMessagingStateContext,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

export const useChatEditorMenu = () => {
	const { loggedInUser } = useUserStateContext()
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

	const buildConversationName = (conversation) => {
		if (conversation.conversation_name) {
			return conversation.conversation_name
		} else if (conversation.users.length > 2) {
			const userNames = conversation.users
				.filter(({ user_id }) => user_id !== loggedInUser.id)
				.map(({ display_name }) => display_name)

			return userNames.join(', ')
		} else {
			return conversation.users?.find((user) => user.user_id !== loggedInUser?.id).display_name
		}
	}

	return {
		buildEditorMenu,
		buildConversationName
	}
}

export const buildUserImageLocation = (userCount) => {
	// return an array of x, y locations
	const circleWidth = 48
	const iconWidth = 19.2
	const padding = 3
	const radius = circleWidth / 2 - (iconWidth / 2 + padding)
	const includedAngle = 360 / userCount
	const angleArray = []

	for (let i = 0; i < userCount; i++) {
		const currentAngle = includedAngle * i
		const currentAngleRad = currentAngle * (Math.PI / 180)

		const y = Math.sin(currentAngleRad) * radius + (radius + padding)
		const x = Math.cos(currentAngleRad) * radius + (radius + padding)
		angleArray.push({ x, y })
	}
	return angleArray
}
