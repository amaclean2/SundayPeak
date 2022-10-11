import { useUserStateContext } from '../../Providers'

const ProfileImage = () => {
	const { workingUser } = useUserStateContext()

	return (
		<img
			src={workingUser.profile_picture_url}
			alt={''}
			className='profile-viewer-image'
		/>
	)
}

export default ProfileImage
