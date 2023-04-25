import { useState } from 'react'
import { useMessages, useMessagingStateContext } from '@amaclean2/sundaypeak-treewells'

import { Button, FormField } from 'Components/Reusable'

const MessageBar = () => {
	const { currentConversationId } = useMessagingStateContext()
	const { sendMessage } = useMessages()
	const [messageText, setMessageText] = useState('')

	const handleEnter = () => {
		sendMessage({ messageBody: messageText, conversationId: currentConversationId })
		setMessageText('')
	}

	if (!currentConversationId) return null

	return (
		<div className='message-bar flex-box full-width'>
			<FormField
				name='message_bar'
				value={messageText}
				autoComplete={'off'}
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
