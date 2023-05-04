import {
	useManipulateFlows,
	useCardStateContext,
	usePictures
} from '@amaclean2/sundaypeak-treewells'

import { Button, FlexSpacer } from '..'

import './styles.css'
import { CarretIcon } from 'Images'

export const ImageViewer = () => {
	const { imageList, galleryImage } = useCardStateContext()
	const { switchImage, closeImageList } = useManipulateFlows()
	const { deletePicture } = usePictures()

	if (!imageList?.length) {
		return null
	}

	const largeImage = imageList[galleryImage]?.replace('/thumbs', '')

	return (
		<div className='image-viewer-background flex-box'>
			<div className='image-viewer-header flex-box'>
				<FlexSpacer />
				<Button
					onClick={() => {
						deletePicture({ url: imageList[galleryImage] })
						closeImageList()
					}}
					id={'image-delete-button'}
					className='delete-button secondary-button'
				>
					delete
				</Button>
				<Button
					onClick={closeImageList}
					id={'image-close-button'}
					className='image-close-button secondary-button'
				>
					close
				</Button>
			</div>
			<div className={'image-carousel flex-box'}>
				<Button
					secondaryButton
					onClick={() => switchImage(galleryImage - 1)}
					disabled={galleryImage === 0}
				>
					<CarretIcon
						color={'#FFFFFF'}
						className={'icon-flipped'}
					/>
				</Button>
				<img
					src={largeImage}
					alt={''}
					className='image-view'
				/>
				<Button
					secondaryButton
					onClick={() => switchImage(galleryImage + 1)}
					disabled={galleryImage >= imageList.length - 1}
				>
					<CarretIcon color={'#FFFFFF'} />
				</Button>
			</div>
		</div>
	)
}
