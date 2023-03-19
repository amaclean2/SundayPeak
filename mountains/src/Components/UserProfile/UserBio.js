import { useUserStateContext } from 'sundaypeak-treewells'

import { Pin } from 'Images'

const UserBio = () => {
	const { workingUser } = useUserStateContext()

	return (
		<>
			{workingUser.city && (
				<div className={'view-location flex-box'}>
					<Pin size={20} />
					{workingUser.city}
				</div>
			)}
			<div className='user-bio'>{workingUser.bio}</div>
		</>
	)
}

export default UserBio
