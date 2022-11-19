import { useEffect } from 'react'
import cx from 'classnames'

import { useFollowUser, useGetUser, useUserStateContext } from '../../Providers'
import { FieldHeader } from '../Reusable'

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
	const { getFriends } = useFollowUser()
	const { friends, workingUser, userDispatch } = useUserStateContext()
	const { getOtherUser } = useGetUser()

	useEffect(() => {
		getFriends({ userId: workingUser.id })
	}, [])

	const handleChangeUser = (friend) => {
		getOtherUser({ userId: friend.follower_id })
		userDispatch({ type: 'clearFriends' })
	}

	if (!friends) return null

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader className='label-field'>Friends</FieldHeader>
			<ul className='tick-list flex-box'>
				{friends?.map((friend, key) => (
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
