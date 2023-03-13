import { useUserPictures } from 'Hooks'
import { useCardStateContext, useUserStateContext } from 'Hooks/Providers'

const UserProfileGallery = () => {
	const { submitPicture } = useUserPictures()
	const { cardDispatch } = useCardStateContext()

	const { workingUser, activeWorkingUser, images } = useUserStateContext()

	const changeHandler = ({ target: { files } }) => {
		submitPicture({ data: files[0] })
	}

	const handleImageClick = (imageSource) => {
		cardDispatch({ type: 'viewingImage', payload: imageSource })
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
					onClick={() => handleImageClick(image)}
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
