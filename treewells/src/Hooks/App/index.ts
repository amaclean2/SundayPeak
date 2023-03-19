import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import { MapPosition } from '../../Types/Adventures'

export const useManipulateFlows = () => {
	const { cardDispatch } = useCardStateContext()
	const { adventureDispatch } = useAdventureStateContext()

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

	const updateStartPosition = (startPosition: MapPosition) => {
		return adventureDispatch({ type: 'updateStartPosition', payload: startPosition })
	}

	return {
		openImage,
		openAlert,
		closeAlert,
		closeCard,
		updateStartPosition
	}
}
