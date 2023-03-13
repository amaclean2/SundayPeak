import { useState } from 'react'

import { Button, FormField } from 'Components/Reusable'
import { useMessagingStateContext } from 'Hooks/Providers'
import { useMessagingConnection } from 'Hooks'

const MessageBar = () => {
	const { currentConversationId } = useMessagingStateContext()
	const { sendMessage } = useMessagingConnection()
	const [messageText, setMessageText] = useState('')

	const handleEnter = () => {
		sendMessage({ messageBody: messageText, conversationId: currentConversationId })
		setMessageText('')
	}

	return (
		<div className='message-bar flex-box full-width'>
			<FormField
				name='message_bar'
				value={messageText}
				onChange={(e) => setMessageText(e.target.value)}
				isEditable
				placeholder={'Message'}
				options={{
					onEnter: handleEnter
				}}
			/>
			<Button
				onClick={handleEnter}
				className='send-message-button'
				id='send-message-button'
			>
				Send
			</Button>
		</div>
	)
}

export default MessageBar
