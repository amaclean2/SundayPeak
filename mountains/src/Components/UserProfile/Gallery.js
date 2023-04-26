import { useUserStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

const UserProfileGallery = () => {
	const { openImage } = useManipulateFlows()

	const { workingUser, activeWorkingUser, images } = useUserStateContext()

	const changeHandler = ({ target: { files } }) => {
		console.log('picture submitted')
		// submitPicture({ data: files[0] })
	}

	if (activeWorkingUser && !workingUser.imaages?.length) {
		return null
	}

	return (
		<div className='scroller-container flex-box'>
			{images.map((image, key) => (
				<img
					src={image}
					alt={''}
					key={`profile_image_${key}`}
					onClick={() => openImage(image)}
				/>
			))}
			<label
				className='file-upload-container flex-box'
				key={`profile_image_create`}
			>
				Add a new photo
				<input
					type='file'
					name='image'
					className='image-input'
					onChange={changeHandler}
				/>
			</label>
		</div>
	)
}

export default UserProfileGallery
