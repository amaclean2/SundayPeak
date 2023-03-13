import { useState } from 'react'
import cx from 'classnames'

import { FlexSpacer, FormField } from 'Components/Reusable'
import { useGetUser, useMessagingConnection } from 'Hooks'
import { useMessagingStateContext, useUserStateContext } from 'Hooks/Providers'
import { useDebounce } from 'Hooks/Providers/utils'

const ConversationSelector = () => {
	const { searchFriends } = useGetUser()
	const { conversations, currentConversationId } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const { addConversation, getConversation } = useMessagingConnection()

	const [searchList, setSearchList] = useState(null)
	const [textSearch, setTextSearch] = useState('')

	const getSearchResults = useDebounce((search) => {
		if (search.length <= 3) return setSearchList(null)

		searchFriends({ search }).then((users) => {
			setSearchList(users)
		})
	})

	const handleSearch = (event) => {
		setTextSearch(event.target.value)
		getSearchResults(event.target.value)
	}

	const buildConversationName = (conversation) => {
		if (conversation.conversation_name) {
			return conversation.conversation_name
		} else {
			return (
				conversation.users?.find((user) => user.user_id !== loggedInUser?.id).display_name || ''
			)
		}
	}

	const buildList = () => {
		if (searchList?.length) {
			return (
				<>
					{searchList.map((friend, key) => (
						<li
							key={`search_friend_list_${key}`}
							className='flex-box'
							onClick={() => {
								setTextSearch('')
								setSearchList(null)
								addConversation({ userId: friend.id, name: friend.display_name })
							}}
						>
							{friend.profile_picture_url && (
								<img
									src={friend.profile_picture_url}
									alt={''}
								/>
							)}
							{`${friend.display_name}`}
						</li>
					))}
				</>
			)
		} else if (conversations) {
			return (
				<>
					{Object.values(conversations).map((conversation, key) => (
						<li
							key={`conversation_${key}`}
							className={cx(
								'flex-box',
								currentConversationId === conversation.conversation_id && 'current-conversation'
							)}
							onClick={() => getConversation({ conversationId: conversation.conversation_id })}
						>
							<span>{buildConversationName(conversation)}</span>
							<span>{conversation.last_message}</span>
							{conversation.unread && <div className='notification-button' />}
						</li>
					))}
				</>
			)
		} else {
			return null
		}
	}

	return (
		<div className={'conversation-selector full-width'}>
			<FormField
				value={textSearch}
				name={''}
				onChange={handleSearch}
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
