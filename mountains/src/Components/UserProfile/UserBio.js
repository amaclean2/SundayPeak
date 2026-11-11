import { useFollowUser, useUserStateContext } from 'State'
import { Button } from 'Components/Reusable'

import { Pin } from 'Images'

const UserBio = () => {
	const { workingUser, loggedInUser } = useUserStateContext()
	const { friendUser } = useFollowUser()

	const alreadyFollowed = loggedInUser.friends?.some(({ user_id }) => workingUser?.id === user_id)

	return (
		<div className='flex-box user-bio-text'>
			<div className='user-bio-name'>{`${workingUser.first_name} ${workingUser.last_name}`}</div>
			<div className='user-bio-details'>
				{workingUser.city && (
					<>
						<Pin size={16} />
						<div>{workingUser.city}</div>
					</>
				)}
				<div className='user-bio'>
					{workingUser.bio}
				</div>
			</div>
			{workingUser !== loggedInUser && !alreadyFollowed && (
				<Button
					small
					onClick={() => friendUser({ leaderId: workingUser.id, followerId: loggedInUser.id })}
				>
					Friend {workingUser.first_name}
				</Button>
			)}
		</div>
	)
}

export default UserBio
