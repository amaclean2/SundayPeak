import type { MessageAction, MessageState } from '../../Types/Messages'

export const initialMessagingState: MessageState = {
	conversations: null,
	messages: null,
	currentConversationId: null,
	websocket: null,
	error: null
}

// used later in send and receive messages
let currentMessages

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
	switch (action.type) {
		case 'initiateConnection':
			return { ...state, websocket: action.payload }
		case 'setConversations':
			return { ...state, conversations: action.payload }
		case 'addNewConversation':
			return {
				...state,
				currentConversationId: action.payload.conversation_id,
				conversations: {
					...state.conversations,
					[action.payload.conversation_id.toString()]: {
						...action.payload,
						unread: false,
						last_message: ''
					}
				}
			}
		case 'setCurrentConversation':
			if (state.conversations?.[action.payload] === undefined) {
				return {
					...state,
					error: 'Cannot set a current conversation without it existing in the conversations'
				}
			}

			return {
				...state,
				currentConversationId: action.payload,
				conversations: {
					...state.conversations,
					[action.payload]: {
						...state.conversations[action.payload],
						unread: false
					}
				}
			}
		case 'setMessages':
			return { ...state, messages: action.payload }
		case 'sendMessage':
			currentMessages = state.messages ?? []

			if (state.currentConversationId === null) {
				return {
					...state,
					error: 'A current conversation needs to be selected before a message can be sent'
				}
			}

			if (state.conversations?.[state.currentConversationId] === undefined) {
				return {
					...state,
					error: 'A conversation needs to be established before a message can be sent'
				}
			}

			return {
				...state,
				messages: [
					...currentMessages,
					{
						message_body: action.payload.messageBody,
						conversation_id: state.currentConversationId ?? 0,
						user_id: action.payload.userId,
						data_reference: action.payload.dataReference ?? ''
					}
				],
				conversations: {
					...state.conversations,
					[state.currentConversationId]: {
						...state.conversations?.[state.currentConversationId],
						last_message: action.payload.messageBody,
						unread: false
					}
				}
			}
		case 'receiveMessage':
			currentMessages = state.messages ?? []

			if (state.conversations?.[action.payload.conversation_id] === undefined) {
				return {
					...state,
					error:
						"Figure out how to handle receiving a message from a conversation that doesn't exist yet"
				}
			}

			return {
				...state,
				messages: [...currentMessages, action.payload],
				conversations: {
					...state.conversations,
					[action.payload.conversation_id]: {
						...state.conversations?.[action.payload.conversation_id],
						last_message: action.payload.message_body,
						unread: action.payload.conversation_id !== state.currentConversationId
					}
				}
			}
		default:
			return state
	}
}
