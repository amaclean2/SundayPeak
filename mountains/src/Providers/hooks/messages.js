import { child, getDatabase, push, ref, set, update } from 'firebase/database'

export const useHandleMessages = () => {
	const createNewMessagingUser = ({ id, email, profile_picture_url, name }) => {
		const db = getDatabase()
		const userRef = ref(db, `users/${id}`)
		return set(userRef, {
			email,
			profile_picture_url,
			conversations: false,
			name
		})
	}

	const createNewConversation = ({ conversationBody, userId }) => {
		const db = getDatabase()
		const newConversationKey = push(child(ref(db), `conversations`)).key

		const updates = {}
		updates[`conversations/${newConversationKey}`] = conversationBody
		updates[`users/${userId}/conversations/${newConversationKey}`] = true
		updates[`users/${userId}/activeConversation`] = newConversationKey

		return update(ref(db), updates)
	}

	const setCurrentConversation = ({ userId, conversationId }) => {
		const db = getDatabase()

		return update(ref(db), { [`users/${userId}/activeConversation`]: conversationId })
	}

	return {
		createNewMessagingUser,
		createNewConversation,
		setCurrentConversation
	}
}
