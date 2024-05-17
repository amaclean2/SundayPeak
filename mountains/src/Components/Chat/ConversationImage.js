import { useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import React from 'react'

import { buildUserImageLocation } from './utils'

const ConversationImage = ({ conversation }) => {
	const { loggedInUser } = useUserStateContext()

	if (!loggedInUser?.id) {
		return null
	}

	const locationArray = buildUserImageLocation(conversation.users.length - 1)

	if (conversation.conversation_icon) {
		return (
			<img
				src={conversation.conversation_icon}
				className='conversation-icon'
			/>
		)
	} else if (conversation.users.length < 3) {
		const imageUrl = conversation.users.find(
			({ user_id }) => user_id !== loggedInUser?.id
		).profile_picture_url

		if (!imageUrl) {
			return <div className='conversation-icon multi-image-container' />
		}

		return (
			<img
				src={imageUrl}
				alt=''
				className='conversation-icon'
			/>
		)
	} else if (conversation.users) {
		return (
			<div className='conversation-icon multi-image-container'>
				{conversation.users
					.filter(({ user_id }) => user_id !== loggedInUser.id)
					.map(({ profile_picture_url }, idx) => (
						<img
							src={profile_picture_url}
							className='multi-image-icon'
							style={{ top: locationArray[idx].y, left: locationArray[idx].x }}
						/>
					))}
			</div>
		)
	}
}

export default ConversationImage
