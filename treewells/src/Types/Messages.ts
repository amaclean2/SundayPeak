import type { Dispatch } from 'react'

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

export type ConversationsType = Record<string | number, ConversationType>

type NewConnectionType = {
	type: 'initiateConnection'
	payload: WebSocket
}

type ReceiveConversations = {
	type: 'addNewConversation'
	payload: ConversationType
}

type SetConversations = {
	type: 'setConversations'
	payload: ConversationsType | null
}

type SetCurrentConversation = {
	type: 'setCurrentConversation'
	payload: number
}

type SetMessages = {
	type: 'setMessages'
	payload: MessageType[]
}

type CreateMessage = {
	type: 'receiveMessage'
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
	| ReceiveConversations
	| SetConversations
	| SetMessages
	| CreateMessage
	| SendMessage
	| SetCurrentConversation

export type MessageState = {
	conversations: ConversationsType | null
	messages: MessageType[] | null
	currentConversationId: number | null
	websocket: WebSocket | null
	error: string | null
}

export type MessageContext = MessageState & { messageDispatch: Dispatch<MessageAction> }
