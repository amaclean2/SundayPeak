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
import { useCardStateContext } from 'Providers'

import './styles.css'
import { useState } from 'react'

const MessagingContianer = () => {
	const { screenType } = useCardStateContext()
	const [isSelectorOpen, setIsSelectorOpen] = useState(true)

	const handleOnClose = () => {}

	return (
		<DisplayCard
			onClose={handleOnClose}
			configuration={'left'}
		>
			<ProfileHeader slim>
				{!screenType.mobile && (
					<FieldHeader
						className='page-header signup-header-text'
						text={`Plan with Your Friends`}
					/>
				)}
				<FlexSpacer />
			</ProfileHeader>
			<ProfileContent className={cx('messaging-content', !screenType.mobile && 'flex-box')}>
				<ConversationSelector
					className={isSelectorOpen && 'open'}
					toggleSelectorOpen={() => setIsSelectorOpen(!isSelectorOpen)}
				/>
				<div className={cx('chat-content flex-box', !isSelectorOpen && 'open')}>
					<MessageBody toggleSelectorOpen={() => setIsSelectorOpen(!isSelectorOpen)} />
					<MessageBar />
				</div>
			</ProfileContent>
		</DisplayCard>
	)
}

export default MessagingContianer
