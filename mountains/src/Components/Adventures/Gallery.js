import {
	useAdventureStateContext,
	useManipulateFlows,
	usePictures
} from '@amaclean2/sundaypeak-treewells'

import './styles.css'

const PhotoGallery = () => {
	const { setImageList } = useManipulateFlows()
	const { currentAdventure } = useAdventureStateContext()
	const { savePicture } = usePictures()

	const changeHandler = ({ target: { files } }) => {
		const formData = new FormData()
		formData.append('image', files[0])
		formData.append('adventure_id', currentAdventure.id)

		savePicture({ isProfilePicture: false, formData, isAdventure: true })
	}

	return (
		<div className='scroller-container flex-box'>
			{currentAdventure.images.map((image, key) => (
				<img
					src={image}
					alt={''}
					key={`profile_image_${key}`}
					onClick={() => setImageList(currentAdventure.images, key)}
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

export default PhotoGallery
