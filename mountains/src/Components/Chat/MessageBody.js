import { useEffect, useRef } from 'react'
import cx from 'classnames'
import Linkify from 'linkify-react'
import { useMessagingStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { FlexSpacer } from 'Components/Reusable'

const MessageBody = () => {
	const scrollRef = useRef()
	const { currentConversationId, messages } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()

	useEffect(() => {
		if (!scrollRef.current) {
			return
		}

		scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}, [messages])

	if (!currentConversationId) {
		return <FlexSpacer />
	}

	return (
		<div
			ref={scrollRef}
			className='messages-content flex-box'
		>
			<ul className={'conversation-messages'}>
				{messages?.map((message, key) => (
					<li
						key={`message_${key}`}
						className={cx('flex-box', message.user_id === loggedInUser?.id && 'me')}
					>
						<span className='message-text'>
							<Linkify options={{ defaultProtocol: 'https' }}>{message.message_body}</Linkify>
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}

export default MessageBody
