import { useCardStateContext, useUserPictures, useUserStateContext } from '../../../Providers'
import getContent from '../../../TextContent'
import './styles.css'

export const PhotoGallery = () => {
	const { submitPicture } = useUserPictures()

	const { cardDispatch } = useCardStateContext()

	const { workingUser, activeWorkingUser } = useUserStateContext()

	const changeHandler = ({ target: { files } }) => {
		submitPicture({ data: files[0] })
	}

	const userImages = !activeWorkingUser ? [...workingUser.images, 'new'] : workingUser.images

	const handleImageClick = (imageSource) => {
		cardDispatch({ type: 'viewingImage', payload: imageSource })
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
							{getContent('adventurePanel.addNewPhoto')}
							<input
								type='file'
								name='file'
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
