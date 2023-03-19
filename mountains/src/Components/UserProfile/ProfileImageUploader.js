import cx from 'classnames'
import { useUserStateContext } from 'sundaypeak-treewells'

import { Button } from 'Components/Reusable'

const ProfileImageUploader = () => {
	const { workingUser } = useUserStateContext()

	const handleUpload = ({ target: { files } }) => {
		console.log('profile photo updated')
		// updateProfilePicture({ data: files[0] })
	}

	const deleteProfileImage = () => {
		console.log('picture deleted')
		// userDispatch({ type: 'workingUser', payload: { ...workingUser, profile_picture_url: '' } })
		// deletePicture({ pictureRef: workingUser.profile_picture_url })
	}

	return (
		<div className='profile-image-uploader flex-box'>
			<label className='label-field'>My Photo</label>
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
				<label
					className={cx(
						'file-upload-container overlay-upload-button flex-box',
						workingUser.profile_picture_url && 'hidden-upload'
					)}
					key={`profile_image_create`}
				>
					<input
						type='file'
						name='image'
						className='image-input'
						onChange={handleUpload}
					/>
				</label>
				<div className='upload-photo-button-container flex-box'>
					<Button
						className='image-remove-button'
						id='image-remove-button'
						onClick={deleteProfileImage}
					>
						Remove
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ProfileImageUploader
