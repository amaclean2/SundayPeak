import { WEBSOCKET_URI } from 'Constants'
import { useMessagingStateContext } from 'Hooks/Providers'

export const useMessagingConnection = () => {
	const { messagingDispatch, websocket, conversations, currentConversationId } =
		useMessagingStateContext()

	const initiateConnection = () => {
		if (websocket) {
			websocket.close()
		}

		const localWebsocket = new WebSocket(WEBSOCKET_URI)

		localWebsocket.onopen = () => {
			localWebsocket.send(
				JSON.stringify({
					type: 'verifyUser',
					token: localStorage.getItem('token')
				})
			)
		}

		localWebsocket.onmessage = ({ data }) => {
			const response = JSON.parse(data)
			if (response.connected) {
				localWebsocket.send(JSON.stringify({ type: 'getAllConversations' }))
			} else if (response.conversations) {
				messagingDispatch({ type: 'saveConversations', payload: response.conversations })
			} else if (response.messages) {
				messagingDispatch({ type: 'saveMessages', payload: response.messages })
			} else if (response.conversation) {
				messagingDispatch({
					type: 'saveConversations',
					payload: {
						...conversations,
						[response.conversation.conversation_id]: {
							last_message: '',
							unread: false,
							conversation_id: response.conversation.conversation_id,
							conversation_name: response.conversation.conversation_name
						}
					}
				})
			} else if (response.message) {
				messagingDispatch({ type: 'addMessage', payload: response.message })
			}
		}

		localWebsocket.onclose = () => {
			console.log('The web socket has been closed')
		}

		messagingDispatch({ type: 'initiateConnection', payload: localWebsocket })
	}

	const addConversation = ({ userId, name }) => {
		websocket.send(JSON.stringify({ type: 'createNewConversation', userIds: [userId], name }))
	}

	const sendMessage = ({ messageBody, conversationId }) => {
		websocket.send(JSON.stringify({ type: 'sendMessage', messageBody, conversationId }))
	}

	const getConversation = ({ conversationId }) => {
		websocket.send(JSON.stringify({ type: 'getConversation', conversationId }))
		messagingDispatch({ type: 'getConversation', payload: conversationId })
	}

	const closeConnection = () => {
		websocket.close(1000, 'Conversation window was closed')
	}

	return {
		initiateConnection,
		addConversation,
		getConversation,
		sendMessage,
		closeConnection
	}
}
