import cx from 'classnames'
import { useUserStateContext, usePictures } from '@amaclean2/sundaypeak-treewells'

import { Button } from 'Components/Reusable'

const ProfileImageUploader = () => {
	const { workingUser } = useUserStateContext()
	const { savePicture } = usePictures()

	const handleUpload = ({ target: { files } }) => {
		const formData = new FormData()
		formData.append('image', files[0])
		formData.append('previous_profile_url', workingUser.profile_picture_url)

		savePicture({ isProfilePicture: true, formData })
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
