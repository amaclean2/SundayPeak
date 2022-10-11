import { useCardStateContext, usePictures, useUserStateContext } from '../../Providers'

const UserProfileGallery = () => {
	const { submitPicture } = usePictures()
	const { setViewingImage } = useCardStateContext()

	const { workingUser, loggedInUser } = useUserStateContext()

	const changeHandler = ({ target: { files } }) => {
		submitPicture({ data: files[0] })
	}

	const userImages =
		workingUser.id === loggedInUser.id ? [...workingUser.images, 'new'] : workingUser.images

	const handleImageClick = (imageSource) => {
		setViewingImage(imageSource)
	}

	return (
		<div className='scroller-container flex-box'>
			{userImages.map((image, key) => {
				if (image === 'new') {
					return (
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
					)
				}

				return (
					<img
						src={image}
						alt={''}
						key={`profile_image_${key}`}
						onClick={() => handleImageClick(image)}
					/>
				)
			})}
		</div>
	)
}

export default UserProfileGallery
