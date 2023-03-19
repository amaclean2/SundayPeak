import { useManipulateFlows, useCardStateContext } from 'sundaypeak-treewells'

import { Button, FlexSpacer } from '..'

import './styles.css'

export const ImageViewer = () => {
	const { galleryImage } = useCardStateContext()
	const { openImage } = useManipulateFlows()

	const largeImage = galleryImage?.replace('/thumbs', '')

	const closeViewer = () => {
		openImage(null)
	}

	if (!galleryImage) {
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
					onClick={() => console.log('deleted')}
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
