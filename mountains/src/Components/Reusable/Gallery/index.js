import { useManipulateFlows, useUserStateContext } from 'sundaypeak-treewells'
import getContent from 'TextContent'
import './styles.css'

export const PhotoGallery = () => {
	const { openImage } = useManipulateFlows()

	const { workingUser, activeWorkingUser } = useUserStateContext()

	const changeHandler = ({ target: { files } }) => {
		console.log('picture submitted')
		// submitPicture({ data: files[0] })
	}

	const userImages = !activeWorkingUser ? [...workingUser.images, 'new'] : workingUser.images

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
						onClick={() => openImage(image)}
					/>
				)
			})}
		</div>
	)
}
