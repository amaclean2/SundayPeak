import { useSubmitAdventurePicture } from 'Hooks'
import { useAdventureStateContext, useCardStateContext } from 'Hooks/Providers'
import getContent from 'TextContent'

import './styles.css'

const PhotoGallery = () => {
	const submitAdventurePicture = useSubmitAdventurePicture()
	const { cardDispatch } = useCardStateContext()
	const { currentAdventure } = useAdventureStateContext()

	const changeHandler = ({ target: { files } }) => {
		submitAdventurePicture({ data: files[0], adventureId: currentAdventure.id })
	}

	const images = [...currentAdventure.images, 'new']

	const handleImageClick = (imageSource) => {
		cardDispatch({ type: 'viewingImage', payload: imageSource })
	}

	return (
		<div className='scroller-container flex-box'>
			{images.map((image, key) => {
				if (image === 'new') {
					return (
						<label
							className='file-upload-container flex-box'
							key={`profile_image_create`}
						>
							{getContent('adventurePanel.addNewPhoto')}
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

export default PhotoGallery