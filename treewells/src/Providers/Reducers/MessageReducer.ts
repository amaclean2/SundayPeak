import type { ConversationType, MessageAction, MessageState } from '../../Types/Messages'

export const initialMessagingState: MessageState = {
	conversations: null,
	messages: null,
	currentConversationId: null,
	websocket: null
}

let currentMessages

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
	switch (action.type) {
		case 'initiateConnection':
			return { ...state, websocket: action.payload }
		case 'setCurrentConversation':
			return {
				...state,
				currentConversationId: action.payload,
				conversations: {
					...state.conversations,
					[action.payload]: {
						...(state.conversations?.[action.payload] as ConversationType),
						unread: false
					}
				}
			}
		case 'addNewConversation':
			return {
				...state,
				currentConversationId: action.payload.conversation_id,
				conversations: {
					...state.conversations,
					[action.payload.conversation_id]: action.payload
				}
			}
		case 'setConversations':
			return { ...state, conversations: action.payload }
		case 'setMessages':
			return { ...state, messages: action.payload }
		case 'receiveMessage':
			currentMessages = state.messages ?? []

			return {
				...state,
				messages: [...currentMessages, action.payload],
				conversations: {
					...state.conversations,
					[action.payload.conversation_id]: {
						...(state.conversations?.[action.payload.conversation_id] as ConversationType),
						last_message: action.payload.message_body,
						unread: action.payload.conversation_id !== state.currentConversationId
					}
				}
			}
		case 'sendMessage':
			currentMessages = state.messages ?? []

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
				]
			}
		default:
			return state
	}
}
