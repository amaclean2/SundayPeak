import { child, getDatabase, push, ref, set, update } from 'firebase/database'
import { useUserStateContext } from 'Providers/userStateProvider'
import { useGetUser } from './users'

export const useHandleMessages = () => {
	const { getOtherUser } = useGetUser()
	const { loggedInUser } = useUserStateContext()

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

	const establishNewConversation = (userId, conversations, setTextSearch, setSearchList) => {
		// createNewConversation if it donesn't already exist
		return getOtherUser({ userId }).then((otherUser) => {
			const matchingConversation = conversations.find(({ members }) => members[userId])
			if (matchingConversation) {
				// set the current conversation
				setCurrentConversation({
					userId: loggedInUser.id,
					conversationId: matchingConversation.id
				})
			} else {
				// create a new conversation
				createNewConversation({
					userId: loggedInUser.id,
					conversationBody: {
						last_message: '',
						timestamp: Date.now(),
						members: {
							[loggedInUser.id]: true,
							[otherUser.id]: true
						},
						image: otherUser.profile_picture_url,
						name: {
							[loggedInUser.id]: `${otherUser.first_name} ${otherUser.last_name}`,
							[otherUser.id]: `${loggedInUser.first_name} ${loggedInUser.last_name}`
						}
					}
				})
			}
			setTextSearch('')
			setSearchList(null)
		})
	}

	return {
		createNewMessagingUser,
		createNewConversation,
		setCurrentConversation,
		establishNewConversation
	}
}
