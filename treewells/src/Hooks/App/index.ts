import { useCardStateContext } from '../../Providers/CardStateProvider'

export const useManipulateFlows = () => {
	const { cardDispatch } = useCardStateContext()

	const openImage = (image: string) => {
		return cardDispatch({ type: 'setGalleryImage', payload: image })
	}

	const openAlert = (alert: string) => {
		return cardDispatch({ type: 'openAlert', payload: alert })
	}

	const closeAlert = () => {
		return cardDispatch({ type: 'closeAlert' })
	}

	const closeCard = (message: string) => {
		return cardDispatch({ type: 'closeCardMessage', payload: message })
	}

	return {
		openImage,
		openAlert,
		closeAlert,
		closeCard
	}
}
