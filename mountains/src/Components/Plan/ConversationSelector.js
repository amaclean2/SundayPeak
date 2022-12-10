import { useEffect, useState } from 'react'
import cx from 'classnames'

import { FlexSpacer, FormField } from 'Components/Reusable'
import {
	useGetUser,
	useHandleMessages,
	useMessagingStateContext,
	useUserStateContext
} from 'Providers'

const ConversationSelector = ({ className, toggleSelectorOpen }) => {
	const { searchFriends, getOtherUser } = useGetUser()
	const { conversations } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const { setCurrentConversation, createNewConversation } = useHandleMessages()

	const [searchList, setSearchList] = useState(null)
	const [textSearch, setTextSearch] = useState('')

	useEffect(() => {
		if (textSearch.length) {
			searchFriends({ keywords: textSearch }).then(setSearchList)
		}
	}, [textSearch, searchFriends])

	const establishNewConversation = (userId) => {
		// createNewConversation if it donesn't already exist
		toggleSelectorOpen()
		return getOtherUser({ userId }).then((otherUser) => {
			const matchingConversation = conversations.find(({ members }) => members[userId])
			if (matchingConversation) {
				// set the current conversation
				setCurrentConversation({
					userId: loggedInUser.id,
					conversationId: matchingConversation.id
				})
			} else {
				// create a new conversation
				createNewConversation({
					userId: loggedInUser.id,
					conversationBody: {
						last_message: '',
						timestamp: Date.now(),
						members: {
							[loggedInUser.id]: true,
							[otherUser.id]: true
						},
						name: {
							[loggedInUser.id]: `${otherUser.first_name} ${otherUser.last_name}`,
							[otherUser.id]: `${loggedInUser.first_name} ${loggedInUser.last_name}`
						}
					}
				})
			}
			textSearch.current = ''
			setSearchList(null)
		})
	}

	const buildList = () => {
		if (searchList && searchList.length) {
			return (
				<>
					{searchList.map((friend, key) => (
						<li
							key={`search_friend_list_${key}`}
							className='flex-box'
							onClick={() => establishNewConversation(friend.user_id)}
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
							onClick={() => {
								setCurrentConversation({ userId: loggedInUser.id, conversationId: conversation.id })
								toggleSelectorOpen()
							}}
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
