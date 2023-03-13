import { createContext, useContext, useReducer } from 'react'
import { useUserStateContext } from './userStateProvider'

const MessagingStateContext = createContext()

export const useMessagingStateContext = () => {
	const context = useContext(MessagingStateContext)

	if (context === undefined) {
		throw new Error('useMessagingStateContext must be used within a MessagingStateProvider')
	}
	return context
}

export const MessagingStateProvider = ({ children }) => {
	const { loggedInUser } = useUserStateContext()

	const initialMessagingState = {
		conversations: null,
		messages: null,
		currentConversationId: null,
		websocket: null
	}

	const messageReducer = (state, action) => {
		switch (action.type) {
			case 'initiateConnection':
				return { ...state, websocket: action.payload }
			case 'getConversation':
				return {
					...state,
					currentConversationId: action.payload,
					conversations: {
						...state.conversations,
						[action.payload]: { ...state.conversations[action.payload], unread: false }
					}
				}
			case 'saveConversations':
				return { ...state, conversations: action.payload }
			case 'saveMessages':
				return { ...state, messages: action.payload }
			case 'addMessage':
				return {
					...state,
					messages: state.messages ? [...state.messages, action.payload] : [action.payload],
					conversations:
						action.payload.conversation_id !== state.currentConversationId
							? {
									...state.conversations,
									[action.payload.conversation_id]: {
										...state.conversations[action.payload.conversation_id],
										unread: true,
										last_message: action.payload.message_body
									}
							  }
							: {
									...state.conversations,
									[action.payload.conversation_id]: {
										...state.conversations[action.payload.conversation_id],
										last_message: action.payload.message_body
									}
							  }
				}
			case 'sendMessage':
				return {
					...state,
					messages: [
						...state.messages,
						{
							message_body: action.payload,
							conversation_id: state.currentConversationId,
							user_id: loggedInUser.id
						}
					]
				}
			default:
				return state
		}
	}

	const [messageState, messagingDispatch] = useReducer(messageReducer, initialMessagingState)

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
