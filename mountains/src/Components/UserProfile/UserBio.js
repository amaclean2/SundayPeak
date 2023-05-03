import { useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { Pin } from 'Images'

const UserBio = () => {
	const { workingUser } = useUserStateContext()

	return (
		<div className='flex-box user-bio-text'>
			{workingUser.city && (
				<div className={'view-location flex-box'}>
					<Pin size={20} />
					{workingUser.city}
				</div>
			)}
			<div className='user-bio'>{workingUser.bio}</div>
		</div>
	)
}

export default UserBio
