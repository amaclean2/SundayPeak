import React from 'react'
import { useMessagingStateContext } from '../Providers/MessageStateProvider'

const MessageTestConsumer = (): JSX.Element => {
	const { conversations, messages, currentConversationId, error, messageDispatch } =
		useMessagingStateContext()

	const setConversations = (): void => {
		messageDispatch({
			type: 'setConversations',
			payload: {
				'1': {
					users: [
						{ display_name: 'Stuart', profile_picture_url: '', user_id: 1 },
						{ display_name: 'Chaz', profile_picture_url: '', user_id: 2 }
					],
					conversation_name: 'Your Conversation',
					last_message: '',
					unread: false,
					conversation_id: 1
				}
			}
		})
	}

	const addNewConversation = (): void => {
		messageDispatch({
			type: 'addNewConversation',
			payload: {
				conversation_id: 2,
				users: [
					{ display_name: 'Stuart', profile_picture_url: '', user_id: 1 },
					{ display_name: 'Amy', profile_picture_url: '', user_id: 3 }
				],
				conversation_name: 'My Conversation',
				last_message: '',
				unread: false
			}
		})
	}

	const setCurrentConversation = (): void => {
		messageDispatch({ type: 'setCurrentConversation', payload: 1 })
	}

	const setMessages = (): void => {
		messageDispatch({
			type: 'setMessages',
			payload: [
				{
					data_reference: '',
					display_name: 'Stuart',
					message_body: 'Hi, how are you?',
					user_id: 1,
					conversation_id: 1
				}
			]
		})
	}

	const receiveMessage = (): void => {
		messageDispatch({
			type: 'receiveMessage',
			payload: {
				data_reference: '',
				message_body: 'Feelin fine',
				user_id: 2,
				conversation_id: 2
			}
		})
	}

	const sendMessage = (): void => {
		messageDispatch({
			type: 'sendMessage',
			payload: {
				dataReference: '',
				messageBody: 'Drinkin wine?',
				userId: 1
			}
		})
	}

	return (
		<div>
			<span>Proof of conversations: {Object.keys(conversations ?? {})?.length}</span>
			<span>Proof of messages: {messages?.length}</span>
			{currentConversationId !== null && (
				<span>Last message: {conversations?.[currentConversationId].last_message}</span>
			)}
			<span>Current conversation id: {currentConversationId}</span>
			<span>Errors: {error}</span>

			<button onClick={setConversations}>Get All Coversations</button>
			<button onClick={addNewConversation}>Add New Conversation</button>
			<button onClick={setCurrentConversation}>Set Current Conversation</button>
			<button onClick={setMessages}>Set Messages</button>
			<button onClick={sendMessage}>Send Message</button>
			<button onClick={receiveMessage}>Receive Message</button>
		</div>
	)
}

export default MessageTestConsumer
