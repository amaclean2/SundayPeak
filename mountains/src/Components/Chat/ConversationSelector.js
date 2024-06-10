import { useRef, useState } from 'react'
import cx from 'classnames'
import {
	useDebounce,
	useMessages,
	useMessagingStateContext,
	useSearch,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { FlexSpacer, FormField } from 'Components/Reusable'
import ConversationImage from './ConversationImage'
import { useChatEditorMenu } from './utils'

const ConversationSelector = () => {
	const { searchUsers } = useSearch()
	const { conversations, currentConversationId } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()
	const { addConversation, getConversation } = useMessages()
	const { buildConversationName } = useChatEditorMenu()

	const [searchList, setSearchList] = useState(null)
	const [textSearch, setTextSearch] = useState('')

	const newName = useRef('')

	console.log({ conversations })

	const getSearchResults = useDebounce((search) => {
		if (search.length <= 3) return setSearchList(null)

		searchUsers({ searchText: search, userId: loggedInUser.id }).then((users) => {
			setSearchList(users)
		})
	})

	const handleSearch = (event) => {
		setTextSearch(event.target.value)
		getSearchResults(event.target.value)
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
								addConversation({ userId: friend.user_id })
								newName.current = friend.display_name
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
							<ConversationImage conversation={conversation} />
							<div className='flex-box conversation-card'>
								<span className='conversation-name'>{buildConversationName(conversation)}</span>
								<span className='last-message'>{conversation.last_message ?? ''}</span>
							</div>
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
			<ul className='friend-search-list flex-box'>{buildList()}</ul>
		</div>
	)
}

export default ConversationSelector
