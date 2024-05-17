import {
	useMessages,
	useMessagingStateContext,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'
import { DisplayCard } from 'Components/Reusable'
import React from 'react'

const NewUserModal = ({ onClose }) => {
	const { loggedInUser } = useUserStateContext()
	const { currentConversationId, conversations } = useMessagingStateContext()
	const { addUserToConversation } = useMessages()

	const currentConversationUsers = conversations[currentConversationId].users.map(
		(user) => user.user_id
	)

	return (
		<DisplayCard
			configuration='center'
			title={'Add a User to the Conversation'}
			hasClose={false}
			blockBackground
			onClose={onClose}
		>
			<ul className='friend-search-list'>
				{loggedInUser.friends
					.filter((friend) => !currentConversationUsers.includes(friend.user_id))
					.map((friend, idx) => (
						<li
							key={`new_user_${idx}`}
							className='flex-box'
							onClick={() =>
								addUserToConversation({
									userId: friend.user_id,
									conversationId: currentConversationId
								})
							}
						>
							<img src={friend.profile_picture_url} />
							{friend.display_name}
						</li>
					))}
			</ul>
		</DisplayCard>
	)
}

export default NewUserModal
