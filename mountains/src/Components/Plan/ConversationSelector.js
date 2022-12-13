import { useState } from 'react'
import cx from 'classnames'

import { FlexSpacer, FormField } from 'Components/Reusable'
import {
	useGetUser,
	useHandleMessages,
	useMessagingStateContext,
	useUserStateContext
} from 'Providers'

const ConversationSelector = ({ className }) => {
	const { searchFriends } = useGetUser()
	const { conversations } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const { setCurrentConversation, establishNewConversation } = useHandleMessages()

	const [searchList, setSearchList] = useState(null)
	const [textSearch, setTextSearch] = useState('')

	const handleSearch = () => {
		searchFriends({ keywords: textSearch }).then(setSearchList)
	}

	const buildList = () => {
		if (searchList && searchList.length) {
			return (
				<>
					{searchList.map((friend, key) => (
						<li
							key={`search_friend_list_${key}`}
							className='flex-box'
							onClick={() =>
								establishNewConversation(
									friend.user_id,
									conversations,
									setTextSearch,
									setSearchList
								)
							}
						>
							<img
								src={friend.profile_picture_url}
								alt={''}
							/>
							{`${friend.first_name} ${friend.last_name}`}
						</li>
					))}
				</>
			)
		} else if (conversations && conversations.length) {
			return (
				<>
					{conversations.map((conversation, key) => (
						<li
							key={`conversation_${key}`}
							className='flex-box'
							onClick={() =>
								setCurrentConversation({ userId: loggedInUser.id, conversationId: conversation.id })
							}
						>
							{conversation.name}
						</li>
					))}
				</>
			)
		} else {
			return null
		}
	}

	return (
		<div className={cx('conversation-selector', className)}>
			<FormField
				value={textSearch}
				name={''}
				onChange={(e) => setTextSearch(e.target.value)}
				options={{ onEnter: handleSearch }}
				isEditable
				placeholder={'Talk to...'}
				autoComplete={'off'}
			/>
			<FlexSpacer />
			<ul className='friend-search-list'>{buildList()}</ul>
		</div>
	)
}

export default ConversationSelector
