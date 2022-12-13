import cx from 'classnames'

import {
	DisplayCard,
	FieldHeader,
	FlexSpacer,
	ProfileContent,
	ProfileHeader
} from 'Components/Reusable'
import MessageBody from './MessageBody'
import ConversationSelector from './ConversationSelector'
import MessageBar from './MessageBar'
import { useCardStateContext, useMessagingStateContext } from 'Providers'

import './styles.css'
import { CarretIcon } from 'Images'

const MessagingContianer = () => {
	const { screenType } = useCardStateContext()
	const { currentConversation, messagingDispatch } = useMessagingStateContext()

	const handleOnClose = () => {}

	const handleConversationHeader = () => {
		if (currentConversation?.name) {
			messagingDispatch({ type: 'clearCurrentConversation' })
		}
	}

	return (
		<DisplayCard
			onClose={handleOnClose}
			configuration={'left'}
		>
			<ProfileHeader
				slim
				className={'messages-header'}
			>
				<FieldHeader
					className='page-header'
					onClick={handleConversationHeader}
				>
					{currentConversation ? (
						<>
							<CarretIcon
								color='#EEE'
								size='18'
							/>
							{currentConversation.name}
						</>
					) : (
						'Conversations'
					)}
				</FieldHeader>
				<FlexSpacer />
			</ProfileHeader>
			<ProfileContent className={cx('messaging-content', !screenType.mobile && 'flex-box')}>
				<ConversationSelector className={currentConversation === null && 'open'} />
				<div className={cx('chat-content flex-box', currentConversation && 'open')}>
					<MessageBody />
					<MessageBar />
				</div>
			</ProfileContent>
		</DisplayCard>
	)
}

export default MessagingContianer
