import { useState } from 'react'

import { Button, FormField } from 'Components/Reusable'
import { getDatabase, push, ref, set } from 'firebase/database'
import { useMessagingStateContext, useUserStateContext } from 'Providers'

const MessageBar = () => {
	const { currentConversation } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const [messageText, setMessageText] = useState('')

	const handleEnter = () => {
		const db = getDatabase()
		const createMessageRef = push(ref(db, `messages/${currentConversation.id}`))
		set(createMessageRef, {
			user: loggedInUser.id,
			text: messageText,
			timestamp: Date.now()
		}).then(() => setMessageText(''))
	}

	return (
		<div className='message-bar flex-box'>
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
