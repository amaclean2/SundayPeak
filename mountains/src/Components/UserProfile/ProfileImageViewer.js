import cx from 'classnames'
import { useUserStateContext } from '@amaclean2/sundaypeak-treewells'

const ProfileImageViewer = () => {
	const { workingUser } = useUserStateContext()

	return (
		<div className='profile-image-uploader flex-box'>
			<div className='flex-box profile-photo-handlers'>
				{workingUser.profile_picture_url ? (
					<img
						src={workingUser.profile_picture_url}
						className='profile-picture'
						alt={''}
					/>
				) : (
					<div className='image-input-background' />
				)}
			</div>
		</div>
	)
}

export default ProfileImageViewer
