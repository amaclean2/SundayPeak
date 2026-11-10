import { Connections, Storage } from '../../config'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import { type MessageType } from '../../Types/Messages'
import { fetcher } from '../../utils'
import { conversationsApi } from '../Apis'

type ResponseType = {
	conversations?: any
	messages?: any
	conversation?: any
	message?: MessageType
	connected?: boolean
	userAdded?: boolean
	conversationId?: number
}

export const useMessages = (): {
	initiateConnection: () => void
	setDeviceToken: ({ deviceToken }: { deviceToken: string }) => void
	addConversation: ({ userId, userIds }: { userId?: number; userIds?: number[] }) => void
	getConversation: ({ conversationId }: { conversationId: number }) => void
	openConversationWithFriend: ({ userId }: { userId: number }) => Promise<void>
	addUserToConversation: ({
		userId,
		conversationId
	}: {
		userId: number
		conversationId: number
	}) => Promise<void>
	sendMessage: ({
		messageBody,
		conversationId,
		senderName
	}: {
		messageBody: string
		conversationId: number
		senderName: string
	}) => void
	closeConnection: (reason: string) => void
} => {
	const {
		messageDispatch,
		websocket,
		apnsDeviceToken,
		conversations: userConversations
	} = useMessagingStateContext()
	const { userDispatch } = useUserStateContext()

	const initiateConnection = (): void => {
		if (websocket !== null) {
			return
		}

		const localWebSocket = new WebSocket(Connections.websocketUrl)
		localWebSocket.binaryType = 'blob'

		localWebSocket.onopen = async (): Promise<void> => {
			console.log('Websocket connection established')
			if (apnsDeviceToken === null && Connections.platform === 'native') {
				console.error('Device token must be present before creating a websocket connection')
				localWebSocket.close(
					1008,
					"device token is not present when trying to create a connection. Please restart the app and try again. If this doesn't work, file a bug report."
				)
			}
			Storage.getItem('token').then((token) =>
				localWebSocket.send(
					JSON.stringify({
						type: 'verifyUser',
						token,
						...(Connections.platform === 'native' && { deviceToken: apnsDeviceToken })
					})
				)
			)
		}

		localWebSocket.onmessage = ({ data }) => {
			let response: ResponseType
			try {
				response = JSON.parse(data)
			} catch (error) {
				userDispatch({ type: 'logout' })
				return console.error(error)
			}

			if (response.connected !== undefined) {
				Storage.getItem('token').then((token) =>
					localWebSocket.send(JSON.stringify({ type: 'getAllConversations', token }))
				)
			} else if (response.conversations !== undefined) {
				messageDispatch({ type: 'setConversations', payload: response.conversations })
			} else if (response.messages !== undefined) {
				messageDispatch({ type: 'setMessages', payload: response.messages })
			} else if (response.conversation !== undefined) {
				// a new conversation was created or an old one was found
				Storage.getItem('token').then(
					(token) =>
						localWebSocket?.send(
							JSON.stringify({
								type: 'getConversation',
								conversationId: response.conversation.conversation_id,
								token
							})
						)
				)
			} else if (response.message !== undefined) {
				messageDispatch({ type: 'receiveMessage', payload: response.message })
			} else if (response.userAdded !== undefined) {
				if (userConversations?.[response.conversationId as number] === undefined) {
					Storage.getItem('token').then((token) =>
						localWebSocket.send(JSON.stringify({ type: 'getAllConversations', token }))
					)
				}
			}
		}

		localWebSocket.onerror = (error) => {
			console.log({ error })
		}

		localWebSocket.onclose = (event) => {
			console.log({ event })
			console.log('The web socket has been closed')
			messageDispatch({ type: 'closeConnection' })
		}

		messageDispatch({ type: 'initiateConnection', payload: localWebSocket })
	}

	const setDeviceToken = ({ deviceToken }: { deviceToken: string }): void => {
		return messageDispatch({ type: 'setDeviceToken', payload: deviceToken })
	}

	const addConversation = ({ userId, userIds }: { userId?: number; userIds?: number[] }): void => {
		if (userId === undefined && userIds === undefined) {
			throw new Error('id or array of ids needs to be provided')
		}

		const submitUserIds = userIds ?? [userId]

		console.log(submitUserIds)

		Storage.getItem('token').then(
			(token) =>
				websocket?.send(
					JSON.stringify({
						type: 'createNewConversation',
						userIds: submitUserIds,
						token
					})
				)
		)
	}

	const openConversationWithFriend = async ({ userId }: { userId: number }): Promise<void> => {
		try {
			const {
				data: { conversation }
			} = await fetcher(`${conversationsApi.create.url}`, {
				method: conversationsApi.create.method,
				body: {
					user_ids: [userId]
				}
			})

			messageDispatch({ type: 'addNewConversation', payload: conversation })
			getConversation({ conversationId: conversation.conversation_id })
		} catch (error) {
			console.log(error)
		}
	}

	const sendMessage = ({
		messageBody,
		conversationId,
		senderName
	}: {
		messageBody: string
		conversationId: number
		senderName: string
	}): void => {
		Storage.getItem('token').then(
			(token) =>
				websocket?.send(
					JSON.stringify({ type: 'sendMessage', messageBody, conversationId, token, senderName })
				)
		)
	}

	const getConversation = ({ conversationId }: { conversationId: number }): void => {
		// set the current conversation id and send a message to the websocket that we'd like all the messages
		// for that conversation
		messageDispatch({ type: 'setCurrentConversation', payload: conversationId })
		Storage.getItem('token').then(
			(token) => websocket?.send(JSON.stringify({ type: 'getConversation', conversationId, token }))
		)
	}

	const closeConnection = (reason: string): void => {
		websocket?.close(1000, `Conversation window was closed: ${reason}`)
		messageDispatch({ type: 'closeConnection' })
	}

	const addUserToConversation = async ({
		userId,
		conversationId
	}: {
		userId: number
		conversationId: number
	}): Promise<void> => {
		Storage.getItem('token').then(
			(token) =>
				websocket?.send(
					JSON.stringify({ type: 'addUserToConversation', userId, conversationId, token })
				)
		)
	}

	return {
		initiateConnection,
		addConversation,
		getConversation,
		openConversationWithFriend,
		sendMessage,
		closeConnection,
		setDeviceToken,
		addUserToConversation
	}
}
