import {
	useUserStateContext,
	useManipulateFlows,
	usePictures
} from '@amaclean2/sundaypeak-treewells'

const UserProfileGallery = () => {
	const { setImageList } = useManipulateFlows()

	const { workingUser, activeWorkingUser } = useUserStateContext()
	const { savePicture } = usePictures()

	const changeHandler = ({ target: { files } }) => {
		const formData = new FormData()
		formData.append('image', files[0])

		savePicture({ isProfilePicture: false, formData })
	}

	if (activeWorkingUser && !workingUser.images?.length) {
		return null
	}

	return (
		<div className='scroller-container flex-box'>
			{workingUser.images.map((image, key) => (
				<img
					src={image}
					alt={''}
					key={`profile_image_${key}`}
					onClick={() => setImageList(workingUser.images, key)}
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
