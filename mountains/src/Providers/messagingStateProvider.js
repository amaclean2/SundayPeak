import { createContext, useContext, useEffect, useReducer } from 'react'
import {
	getDatabase,
	off,
	onChildAdded,
	onChildChanged,
	onValue,
	query,
	ref,
	set
} from 'firebase/database'
import { initializeApp } from 'firebase/app'
import { useUserStateContext } from './userStateProvider'
import { firebaseConfig } from './utils'
import { useHandleMessages } from './hooks'

const MessagingStateContext = createContext()

export const useMessagingStateContext = () => {
	const context = useContext(MessagingStateContext)

	if (context === undefined) {
		throw new Error('useMessagingStateContext must be used within a MessagingStateProvider')
	}
	return context
}

export const MessagingStateProvider = ({ children }) => {
	const { loggedInUser, activeWorkingUser, workingUser } = useUserStateContext()
	const {
		createNewMessagingUser,
		createNewConversationForUser,
		createNewConversation,
		setCurrentConversation
	} = useHandleMessages()

	const firebaseApp = initializeApp(firebaseConfig)

	const initialMessagingState = {
		messageStore: getDatabase(firebaseApp),
		conversations: [],
		currentConversation: null
	}

	const messageReducer = (state, action) => {
		switch (action.type) {
			case 'currentConversation':
				return { ...state, currentConversation: action.payload }
			case 'clearConversations':
				return { ...state, conversations: [] }
			case 'conversations':
				return { ...state, conversations: [...state.conversations, action.payload] }
			case 'readyConversation':
				return {
					...state,
					conversations: [...state.conversations, action.payload],
					currentConversation: action.payload
				}
			default:
				return state
		}
	}

	const [messageState, messagingDispatch] = useReducer(messageReducer, initialMessagingState)

	useEffect(() => {
		// listen for changes to conversations
		const db = getDatabase()

		// references to database objects
		const conversationRef = ref(db, `conversations`)
		const userConversationRef = ref(db, `users/${loggedInUser.id}/conversations`)
		const userConversationActiveRef = ref(db, `users/${loggedInUser.id}/activeConversation`)

		// listen for a new conversation and see if it needs to be added to the conversation picker
		// and set it as the current conversation
		onChildAdded(conversationRef, (snapshot) => {
			const data = snapshot.val()
			messagingDispatch({
				type: 'readyConversation',
				payload: {
					...data,
					name: data.name[loggedInUser.id],
					id: snapshot.key
				}
			})
		})

		// should be triggered if the current conversation has changed
		onValue(userConversationActiveRef, (data) => {
			const conversationId = data.val()
			if (conversationId) {
				// get the full conversation for the active conversation id
				onValue(
					ref(db, `conversations/${conversationId}`),
					(snapshot) => {
						const data = snapshot.val()
						messagingDispatch({
							type: 'currentConversation',
							payload: {
								...data,
								id: conversationId,
								name: data.name[loggedInUser.id]
							}
						})
					},
					{ onlyOnce: true }
				)
			}
		})

		onValue(
			userConversationRef,
			(snapshot) => {
				if (!snapshot.exists()) {
					// there isn't an object for the user
					createNewMessagingUser({
						id: loggedInUser.id,
						email: loggedInUser.email,
						profile_picture_url: loggedInUser.profile_picture_url,
						name: `${loggedInUser.first_name} ${loggedInUser.last_name}`
					})
				} else if (activeWorkingUser) {
					let foundCurrentConversation = false
					// looks through the current conversations on the user and see if any have the recepient
					if (snapshot.val()) {
						snapshot.forEach((conversation) => {
							onValue(
								ref(db, `conversations/${conversation.key}`),
								(convoSnapshot) => {
									if (!foundCurrentConversation) {
										const data = convoSnapshot.val()
										// if the conversation is found then set that as the current conversation
										if (data.members[workingUser.id]) {
											console.log(data, conversation.key)
											foundCurrentConversation = true
											setCurrentConversation({
												userId: loggedInUser.id,
												conversationId: conversation.key
											})
										}
									}
								},
								{ onlyOnce: true }
							)
						})
					}

					// if none have the recepient then a new conversation needs to be created
					if (!foundCurrentConversation) {
						console.log('brand new conversation')
						createNewConversation({
							userId: loggedInUser.id,
							conversationBody: {
								last_message: '',
								timestamp: Date.now(),
								members: {
									[loggedInUser.id]: true,
									[workingUser.id]: true
								},
								name: {
									[loggedInUser.id]: `${workingUser.first_name} ${workingUser.last_name}`,
									[workingUser.id]: `${loggedInUser.first_name} ${loggedInUser.last_name}`
								}
							}
						})
					}
				}
			},
			{
				onlyOnce: true
			}
		)

		return () => {
			const activeConversationRef = ref(db, `users/${loggedInUser.id}/activeConversation`)
			set(activeConversationRef, false)

			// detach listeners
			off(activeConversationRef)
			off(conversationRef)
			off(userConversationRef)
		}
	}, [])

	return (
		<MessagingStateContext.Provider
			value={{
				...messageState,
				messagingDispatch
			}}
		>
			{children}
		</MessagingStateContext.Provider>
	)
}
