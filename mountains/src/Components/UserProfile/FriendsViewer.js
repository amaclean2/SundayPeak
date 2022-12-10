import { useRef, useState } from 'react'
import cx from 'classnames'

import { useGetUser, useUserStateContext } from '../../Providers'
import { FieldHeader, FormField } from '../Reusable'

const Friend = ({ friend, onClick }) => {
	return (
		<li
			onClick={onClick}
			className='tick friend'
		>
			{friend.first_name} {friend.last_name}
		</li>
	)
}

const FriendsViewer = ({ className }) => {
	const { friends, userDispatch } = useUserStateContext()
	const { getOtherUser, searchUsers } = useGetUser()

	const searchText = useRef('')
	const [searchResults, setSearchResults] = useState(null)

	const handleChangeUser = (friend) => {
		getOtherUser({ userId: friend.id, profileSwitch: true })
		userDispatch({ type: 'clearFriends' })
	}

	const handleSearch = (event) => {
		searchText.current = event.target.value
		searchUsers({ keywords: event.target.value }).then(setSearchResults)
	}

	if (!friends) {
		return null
	}

	return (
		<div className={cx(className, 'friend-list-container flex-box')}>
			<FieldHeader className='label-field'>Friends</FieldHeader>
			<FormField
				name='friends_search'
				value={searchText.current}
				isEditable
				onChange={handleSearch}
				className='friends-search'
				placeholder={'Find New Friends'}
				autoComplete={'off'}
				type={'text'}
			/>
			<ul className='tick-list flex-box friend-list'>
				{((searchResults?.length && searchResults) || friends).map((friend, key) => (
					<Friend
						onClick={() => handleChangeUser(friend)}
						friend={friend}
						key={`user_friend_${key}`}
					/>
				))}
			</ul>
		</div>
	)
}

export default FriendsViewer
