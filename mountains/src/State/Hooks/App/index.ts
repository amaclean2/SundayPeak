import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'
import { useTokenStateContext } from '../../Providers/TokenStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import { useZoneStateContext } from '../../Providers/ZoneStateProvider'
import type { MapPosition } from '../../Types/Adventures'
import { type URLType } from '../../Types/Cards'

export const useManipulateFlows = (): {
	switchImage: (index: number) => void
	openAlert: (alert: string) => void
	closeAlert: () => void
	closeCard: (message: string) => void
	updateStartPosition: (startPosition: MapPosition) => void
	setImageList: (imageList: URLType[], index: number) => void
	closeImageList: () => void
	closeAdventureView: () => void
	toggleMenuOpen: (val?: boolean) => void
	toggleEnableAddPath: (val?: boolean) => void
	clearErrors: () => void
} => {
	const { cardDispatch } = useCardStateContext()
	const { adventureDispatch } = useAdventureStateContext()
	const { userDispatch } = useUserStateContext()
	const { messageDispatch } = useMessagingStateContext()
	const { zoneDispatch } = useZoneStateContext()
	const { tokenDispatch } = useTokenStateContext()

	const switchImage = (index: number): void => {
		cardDispatch({ type: 'setGalleryImage', payload: index })
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

	const setImageList = (imageList: URLType[], index: number): void => {
		cardDispatch({ type: 'setImageList', payload: { list: imageList, index } })
	}

	const closeImageList = (): void => {
		cardDispatch({ type: 'setImageList', payload: { list: [], index: 0 } })
	}

	const closeAdventureView = (): void => {
		adventureDispatch({ type: 'closeAdventureView' })
	}

	const toggleMenuOpen = (val?: boolean): void => {
		cardDispatch({ type: 'setIsMenuOpen', ...(val !== undefined && { payload: val }) })
	}

	const toggleEnableAddPath = (val?: boolean): void => {
		cardDispatch({ type: 'toggleAddPath', ...(val !== undefined && { payload: val }) })
	}

	const clearErrors = (): void => {
		adventureDispatch({ type: 'setAdventureError', payload: '' })
		userDispatch({ type: 'setUserError', payload: '' })
		messageDispatch({ type: 'setMessageError', payload: '' })
		zoneDispatch({ type: 'setZoneError', payload: '' })
		tokenDispatch({ type: 'setTokenError', payload: '' })
	}

	return {
		switchImage,
		openAlert,
		closeAlert,
		closeCard,
		updateStartPosition,
		setImageList,
		closeImageList,
		closeAdventureView,
		toggleMenuOpen,
		toggleEnableAddPath,
		clearErrors
	}
}
