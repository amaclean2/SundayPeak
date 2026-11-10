import type { MessageAction, MessageState } from '../../Types/Messages'

export const initialMessagingState: MessageState = {
	conversations: null,
	messages: null,
	currentConversationId: null,
	websocket: null,
	messageError: null,
	newMessages: 0,
	apnsDeviceToken: null
}

// used later in send and receive messages
let currentMessages

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
	switch (action.type) {
		case 'initiateConnection':
			return { ...state, websocket: action.payload }
		case 'closeConnection':
			return { ...state, websocket: null }
		case 'setDeviceToken':
			return { ...state, apnsDeviceToken: action.payload }
		case 'setMessageError':
			return { ...state, messageError: action.payload }
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
						last_message: action.payload.last_message ?? ''
					}
				}
			}
		case 'setCurrentConversation':
			if (state.conversations?.[action.payload] === undefined) {
				return {
					...state,
					messageError: 'Cannot set a current conversation without it existing in the conversations'
				}
			}

			return {
				...state,
				currentConversationId: action.payload,
				messages: [],
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
					messageError: 'A current conversation needs to be selected before a message can be sent'
				}
			}

			if (state.conversations?.[state.currentConversationId] === undefined) {
				return {
					...state,
					messageError: 'A conversation needs to be established before a message can be sent'
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
		case 'receiveMessage': {
			currentMessages = state.messages ?? []

			if (state.conversations?.[action.payload.conversation_id] === undefined) {
				return {
					...state,
					messageError:
						"Figure out how to handle receiving a message from a conversation that doesn't exist yet"
				}
			}

			return {
				...state,
				messages: [action.payload].concat(state.messages ?? []),
				newMessages: state.newMessages + 1,
				conversations: {
					...state.conversations,
					[action.payload.conversation_id]: {
						...state.conversations?.[action.payload.conversation_id],
						last_message: action.payload.message_body,
						unread: action.payload.conversation_id !== state.currentConversationId
					}
				}
			}
		}
		default:
			return state
	}
}
