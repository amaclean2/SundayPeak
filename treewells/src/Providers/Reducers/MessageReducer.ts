import {
	ConversationsType,
	ConversationType,
	MessageAction,
	MessageState,
	MessageType
} from '../../Types/Messages'

export const initialMessagingState: MessageState = {
	conversations: null,
	messages: null,
	currentConversationId: null,
	websocket: null
}

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
	switch (action.type) {
		case 'initiateConnection':
			return { ...state, websocket: action.payload }
		case 'getConversation':
			return {
				...state,
				currentConversationId: action.payload,
				conversations: {
					...(state.conversations as ConversationsType),
					[action.payload]: {
						...(state.conversations?.[action.payload] as ConversationType),
						unread: false
					}
				}
			}
		case 'setConversations':
			return { ...state, conversations: action.payload }
		case 'setMessages':
			return { ...state, messages: action.payload }
		case 'createMessage':
			return {
				...state,
				messages: [...(state.messages as MessageType[]), action.payload],
				conversations: {
					...(state.conversations as ConversationsType),
					[action.payload.conversation_id]: {
						...(state.conversations?.[action.payload.conversation_id] as ConversationType),
						last_message: action.payload.message_body,
						unread: action.payload.conversation_id !== state.currentConversationId
					}
				}
			}
		case 'sendMessage':
			return {
				...state,
				messages: [
					...(state.messages as MessageType[]),
					{
						message_body: action.payload.messageBody,
						conversation_id: state.currentConversationId || 0,
						user_id: action.payload.userId,
						data_reference: action.payload.dataReference || ''
					}
				]
			}
		default:
			return state
	}
}
