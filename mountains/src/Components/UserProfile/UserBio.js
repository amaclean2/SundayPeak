import { useFollowUser, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import { Button } from 'Components/Reusable'

import { Pin } from 'Images'

const UserBio = () => {
	const { workingUser, loggedInUser } = useUserStateContext()
	const { friendUser } = useFollowUser()

	const alreadyFollowed = loggedInUser.friends?.some(({ id }) => workingUser?.id === id)

	return (
		<div className='flex-box user-bio-text'>
			{workingUser.city && (
				<div className={'view-location flex-box'}>
					<Pin size={20} />
					{workingUser.city}
				</div>
			)}
			<div className='user-bio'>{workingUser.bio}</div>
			{workingUser !== loggedInUser && !alreadyFollowed && (
				<Button small onClick={() => 
				friendUser({ leaderId: workingUser.id, followerId: loggedInUser.id })
				}>
					Friend {workingUser.first_name}
					</Button>
			)}
		</div>
	)
}

export default UserBio
