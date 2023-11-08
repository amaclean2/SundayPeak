import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import {
	useMessages,
	useMessagingStateContext,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { DisplayCard } from 'Components/Reusable'
import MessageBody from './MessageBody'
import ConversationSelector from './ConversationSelector'
import MessageBar from './MessageBar'

import './styles.css'
import { useEffect, useState } from 'react'

const MessagingContianer = () => {
	const navigate = useNavigate()
	const { closeConnection } = useMessages()
	const { conversations, currentConversationId } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const [conversationTitle, setConversationTitle] = useState('Conversations')

	useEffect(() => {
		const currentConversation = conversations?.[currentConversationId]
		const newConversationTitle = currentConversation?.users.find(
			(user) => user.user_id !== loggedInUser.id
		)?.display_name
		if (newConversationTitle) {
			setConversationTitle(newConversationTitle)
		}
	}, [conversations, currentConversationId])

	return (
		<DisplayCard
			configuration={'left'}
			title={conversationTitle}
			onClose={() => {
				navigate('/discover')
				closeConnection()
			}}
		>
			<div className={'messaging-container full-width flex-box'}>
				<ConversationSelector />
				<div className={cx('chat-content flex-box full-width')}>
					<MessageBody />
					<MessageBar />
				</div>
			</div>
		</DisplayCard>
	)
}

export default MessagingContianer
