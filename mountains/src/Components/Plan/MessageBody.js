import { useEffect, useState } from 'react'
import { getDatabase, off, onValue, ref } from 'firebase/database'
import cx from 'classnames'
import Linkify from 'linkify-react'

import { FieldHeader } from 'Components/Reusable'
import { useMessagingStateContext, useUserStateContext } from 'Providers'
import { CarretIcon } from 'Images'

const MessageBody = () => {
	const { currentConversation } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const [conversationMessages, setConversationMessages] = useState([])

	useEffect(() => {
		if (currentConversation) {
			const db = getDatabase()
			const currentConversationRef = ref(db, `messages/${currentConversation.id}`)

			// listen to the messages/currentConversation object
			onValue(currentConversationRef, (snapshot) => {
				if (snapshot.exists()) {
					let workingMessages = []
					snapshot.forEach((message) => {
						const messageText = message.val().text
						const messageSender = message.val().user

						workingMessages.push({ text: messageText, sender: messageSender === loggedInUser.id })
					})
					setConversationMessages(workingMessages)
				} else {
					setConversationMessages([])
					console.log(`there isn't a current conversation between you and ${currentConversation}`)
				}
			})

			return () => {
				off(currentConversationRef)
			}
		}
	}, [currentConversation])

	if (!currentConversation) {
		return null
	}

	return (
		<div className='messages-content flex-box'>
			<ul className={'conversation-messages'}>
				{conversationMessages.map((message, key) => (
					<li
						key={`message_${key}`}
						className={cx('flex-box', message.sender && 'me')}
					>
						<span className='message-text'>
							<Linkify options={{ defaultProtocol: 'https' }}>{message.text}</Linkify>
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}

export default MessageBody
