import { useUserPictures } from 'Hooks'
import { useCardStateContext } from 'Hooks/Providers'
import { Button, FlexSpacer } from '..'

import './styles.css'

export const ImageViewer = () => {
	const { viewingImage, cardDispatch } = useCardStateContext()
	const { deletePicture } = useUserPictures()

	const largeImage = viewingImage?.replace('/thumbs', '')

	const closeViewer = () => {
		cardDispatch({ type: 'viewingImage', payload: null })
	}

	if (!viewingImage) {
		return null
	}

	return (
		<div
			className='image-viewer-background flex-box'
			onClick={closeViewer}
		>
			<div className='image-viewer-header flex-box'>
				<FlexSpacer />
				<Button
					onClick={() => deletePicture({ pictureRef: viewingImage })}
					id={'image-delete-button'}
					className='delete-button secondary-button'
				>
					delete
				</Button>
				<Button
					onClick={closeViewer}
					id={'image-close-button'}
					className='image-close-button secondary-button'
				>
					close
				</Button>
			</div>
			<img
				src={largeImage}
				alt={''}
				className='image-view'
			/>
		</div>
	)
}
