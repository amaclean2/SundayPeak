import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useMessages } from 'sundaypeak-treewells'

import { DisplayCard } from 'Components/Reusable'
import MessageBody from './MessageBody'
import ConversationSelector from './ConversationSelector'
import MessageBar from './MessageBar'

import './styles.css'

const MessagingContianer = () => {
	const navigate = useNavigate()
	const { closeConnection } = useMessages()

	return (
		<DisplayCard
			configuration={'left'}
			title={'Conversations'}
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
