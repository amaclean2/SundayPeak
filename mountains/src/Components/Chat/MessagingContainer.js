import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
import { useChatEditorMenu } from './utils'
import NewUserModal from './NewUserModal'

const MessagingContianer = () => {
	const navigate = useNavigate()
	const { closeConnection, initiateConnection } = useMessages()
	const { conversations, currentConversationId, websocket } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const { buildEditorMenu, buildConversationName } = useChatEditorMenu()

	const [conversationTitle, setConversationTitle] = useState('Conversations')
	const [isConversationModalOpen, setIsConversationModalOpen] = useState(false)

	useEffect(() => {
		const currentConversation = conversations?.[currentConversationId]
		if (currentConversation) {
			setConversationTitle(buildConversationName(currentConversation))
		}
	}, [conversations, currentConversationId])

	useEffect(() => {
		if (!websocket) {
			initiateConnection()
		}

		return () => closeConnection('messaging component ended lifecycle')
	}, [])

	useEffect(() => {
		if ([null, undefined].includes(loggedInUser)) {
			navigate('/discover')
		}
	}, [loggedInUser])

	return (
		<>
			<DisplayCard
				menu={buildEditorMenu(() => setIsConversationModalOpen(true))}
				configuration={'left'}
				className={'messaging-display-card'}
				title={conversationTitle}
				onClose={() => navigate('/discover')}
			>
				<div className={'messaging-container full-width flex-box'}>
					<ConversationSelector />
					<div className={cx('chat-content flex-box full-width')}>
						<MessageBody />
						<MessageBar />
					</div>
				</div>
			</DisplayCard>
			{isConversationModalOpen && (
				<NewUserModal onClose={() => setIsConversationModalOpen(false)} />
			)}
		</>
	)
}

export default MessagingContianer
