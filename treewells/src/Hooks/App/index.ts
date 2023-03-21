import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import type { MapPosition } from '../../Types/Adventures'

export const useManipulateFlows = (): {
	openImage: (image: string) => void
	openAlert: (alert: string) => void
	closeAlert: () => void
	closeCard: (message: string) => void
	updateStartPosition: (startPosition: MapPosition) => void
} => {
	const { cardDispatch } = useCardStateContext()
	const { adventureDispatch } = useAdventureStateContext()

	const openImage = (image: string): void => {
		cardDispatch({ type: 'setGalleryImage', payload: image })
	}

	const openAlert = (alert: string): void => {
		cardDispatch({ type: 'openAlert', payload: alert })
	}

	const closeAlert = (): void => {
		cardDispatch({ type: 'closeAlert' })
	}

	const closeCard = (message: string): void => {
		cardDispatch({ type: 'closeCardMessage', payload: message })
	}

	const updateStartPosition = (startPosition: MapPosition): void => {
		adventureDispatch({ type: 'updateStartPosition', payload: startPosition })
	}

	return {
		openImage,
		openAlert,
		closeAlert,
		closeCard,
		updateStartPosition
	}
}
