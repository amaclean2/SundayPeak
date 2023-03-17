import { Dispatch } from 'react'

type ConversationUser = {
	display_name: string
	profile_picture_url: string | null
	user_id: number
}

export type ConversationType = {
	users: ConversationUser[]
	conversation_id: number
	conversation_name?: string
	last_message: string
	unread: boolean
}

export type MessageType = {
	data_reference: string
	display_name?: string
	message_body: string
	user_id: number
	conversation_id: number
}

export type ConversationsType = {
	[key: number | string]: ConversationType
}

type NewConnectionType = {
	type: 'initiateConnection'
	payload: WebSocket
}

type GetConversation = {
	type: 'getConversation'
	payload: number
}

type SetConversations = {
	type: 'setConversations'
	payload: { [key: number | string]: ConversationType }
}

type SetMessages = {
	type: 'setMessages'
	payload: MessageType[]
}

type CreateMessage = {
	type: 'createMessage'
	payload: MessageType
}

type SendMessage = {
	type: 'sendMessage'
	payload: {
		messageBody: string
		userId: number
		dataReference?: string
	}
}

export type MessageAction =
	| NewConnectionType
	| GetConversation
	| SetConversations
	| SetMessages
	| CreateMessage
	| SendMessage

export type MessageState = {
	conversations: { [key: number]: ConversationType } | null
	messages: MessageType[] | null
	currentConversationId: number | null
	websocket: WebSocket | null
}

export type MessageContext = MessageState & { messageDispatch: Dispatch<MessageAction> }
