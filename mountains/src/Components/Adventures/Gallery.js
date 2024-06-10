import {
	useAdventureStateContext,
	useManipulateFlows,
	usePictures,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'

import './styles.css'

const PhotoGallery = ({ spaceType }) => {
	const { setImageList } = useManipulateFlows()
	const { currentAdventure } = useAdventureStateContext()
	const { currentZone } = useZoneStateContext()
	const { savePicture } = usePictures()

	const changeHandler = ({ target: { files } }) => {
		const formData = new FormData()
		formData.append('image', files[0])

		if (spaceType === 'zone') {
			formData.append('zone_id', currentZone.id)
			savePicture({ isProfilePicture: false, formData, isZone: true })
		} else {
			formData.append('adventure_id', currentAdventure.id)
			savePicture({ isProfilePicture: false, formData, isAdventure: true })
		}
	}

	const currentObject = spaceType === 'zone' ? currentZone : currentAdventure

	return (
		<div className='scroller-container flex-box'>
			{currentObject.images.map((image, key) => (
				<img
					src={image}
					alt={''}
					key={`profile_image_${key}`}
					onClick={() => setImageList(currentObject.images, key)}
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
