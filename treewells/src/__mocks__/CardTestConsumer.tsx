import React from 'react'
import { useCardStateContext } from '../Providers/CardStateProvider'

const CardTestConsumer = (): JSX.Element => {
	const { galleryImage, showAlert, alertContent, screenType, cardDispatch } = useCardStateContext()

	const openAlert = (): void => {
		cardDispatch({
			type: 'openAlert',
			payload: 'A New Alert'
		})
	}

	const setGalleryImage = (): void => {
		cardDispatch({
			type: 'setGalleryImage',
			payload: 'https://newImage.com'
		})
	}

	const closeAlert = (): void => {
		cardDispatch({ type: 'closeAlert' })
	}

	const closeCard = (): void => {
		cardDispatch({ type: 'closeCardMessage', payload: 'The card was closed' })
	}

	return (
		<div>
			<span>Gallery image link: {galleryImage}</span>
			<span>Alert state view: {showAlert.toString()}</span>
			<span>Alert content view: {alertContent}</span>
			<span>Screen type viewer: {screenType.browser}</span>

			<button onClick={openAlert}>Open Alert</button>
			<button onClick={setGalleryImage}>Set Gallery Image</button>
			<button onClick={closeAlert}>Close Alert</button>
			<button onClick={closeCard}>Close Card</button>
		</div>
	)
}

export default CardTestConsumer
