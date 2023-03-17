import { SundayPeakServerUrls } from '../../config'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'
import { ConversationsType } from '../../Types/Messages'

export const useMessages = () => {
	const { messageDispatch, websocket, conversations } = useMessagingStateContext()

	const initiateConnection = () => {
		if (websocket) {
			websocket.close()
		}

		const localWebSocket = new WebSocket(SundayPeakServerUrls.websocketUrl)

		localWebSocket.onopen = () => {
			localWebSocket.send(
				JSON.stringify({
					type: 'verifyUser',
					token: localStorage.getItem('token')
				})
			)
		}

		localWebSocket.onmessage = ({ data }) => {
			const response = JSON.parse(data)
			if (response.connected) {
				localWebSocket.send(JSON.stringify({ type: 'getAllConversations' }))
			} else if (response.conversations) {
				messageDispatch({ type: 'getConversation', payload: response.conversations })
			} else if (response.messages) {
				messageDispatch({ type: 'setMessages', payload: response.messages })
			} else if (response.conversation) {
				messageDispatch({
					type: 'setConversations',
					payload: {
						...(conversations as ConversationsType),
						[response.conversation_id]: {
							last_message: '',
							unread: false,
							conversation_id: response.conversation_id,
							users: [],
							conversation_name: response.conversation.conversation_name
						}
					}
				})
			} else if (response.message) {
				messageDispatch({ type: 'createMessage', payload: response.message })
			}
		}

		localWebSocket.onclose = () => {
			console.log('The web socket has been closed')
		}

		messageDispatch({ type: 'initiateConnection', payload: localWebSocket })
	}

	const addConversation = ({ userId, name }: { userId: number; name: string }) => {
		websocket?.send(JSON.stringify({ type: 'createNewConversation', userIds: [userId], name }))
	}

	const sendMessage = ({
		messageBody,
		conversationId
	}: {
		messageBody: string
		conversationId: number
	}) => {
		websocket?.send(JSON.stringify({ type: 'sendMessage', messageBody, conversationId }))
	}

	const getConversation = ({ conversationId }: { conversationId: number }) => {
		websocket?.send(JSON.stringify({ type: 'getConversation', conversationId }))
		messageDispatch({ type: 'getConversation', payload: conversationId })
	}

	const closeConnection = () => {
		websocket?.close(1000, 'Conversation window was closed')
	}

	return {
		initiateConnection,
		addConversation,
		getConversation,
		sendMessage,
		closeConnection
	}
}
