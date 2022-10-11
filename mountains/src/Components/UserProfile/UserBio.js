import { useUserStateContext } from '../../Providers'

const UserBio = () => {
	const { workingUser } = useUserStateContext()

	return <div className='user-bio'>{workingUser.bio}</div>
}

export default UserBio
