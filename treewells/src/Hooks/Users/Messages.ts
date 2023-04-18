import { Connections, Storage } from '../../config'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'

export const useMessages = (): {
	initiateConnection: () => void
	addConversation: ({ userId, name }: { userId: number; name: string }) => void
	getConversation: ({ conversationId }: { conversationId: number }) => void
	sendMessage: ({
		messageBody,
		conversationId
	}: {
		messageBody: string
		conversationId: number
	}) => void
	closeConnection: () => void
} => {
	const { messageDispatch, websocket } = useMessagingStateContext()

	const initiateConnection = (): void => {
		if (websocket !== null) {
			websocket.close()
		}

		const localWebSocket = new WebSocket(Connections.websocketUrl)

		localWebSocket.onopen = async (): Promise<void> => {
			const token = await Storage.getItem('token')
			localWebSocket.send(JSON.stringify({ type: 'verifyUser', token }))
		}

		localWebSocket.onmessage = ({ data }) => {
			const response = JSON.parse(data)
			if (response.connected !== undefined) {
				localWebSocket.send(JSON.stringify({ type: 'getAllConversations' }))
			} else if (response.conversations !== undefined) {
				messageDispatch({ type: 'setConversations', payload: response.conversations })
			} else if (response.messages !== undefined) {
				messageDispatch({ type: 'setMessages', payload: response.messages })
			} else if (response.conversation !== undefined) {
				messageDispatch({
					type: 'addNewConversation',
					payload: response.conversation
				})
			} else if (response.message !== undefined) {
				messageDispatch({ type: 'receiveMessage', payload: response.message })
			}
		}

		localWebSocket.onclose = () => {
			console.log('The web socket has been closed')
		}

		messageDispatch({ type: 'initiateConnection', payload: localWebSocket })
	}

	const addConversation = ({ userId, name }: { userId: number; name: string }): void => {
		websocket?.send(JSON.stringify({ type: 'createNewConversation', userIds: [userId], name }))
	}

	const sendMessage = ({
		messageBody,
		conversationId
	}: {
		messageBody: string
		conversationId: number
	}): void => {
		websocket?.send(JSON.stringify({ type: 'sendMessage', messageBody, conversationId }))
	}

	const getConversation = ({ conversationId }: { conversationId: number }): void => {
		// set the current conversation id and send a message to the websocket that we'd like all the messages
		// for that conversation
		messageDispatch({ type: 'setCurrentConversation', payload: conversationId })
		websocket?.send(JSON.stringify({ type: 'getConversation', conversationId }))
	}

	const closeConnection = (): void => {
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
