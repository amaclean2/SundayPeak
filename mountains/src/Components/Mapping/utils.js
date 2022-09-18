import { CARD_STATES, useAdventureEditContext, useCardStateContext } from '../../Providers'

export const useCreateNewAdventure = () => {
	const {
		adventureAddState,
		setAllAdventures,
		setCurrentAdventure,
		setIsEditable,
		setAdventureAddState
	} = useAdventureEditContext()
	const { openCard } = useCardStateContext()

	const handleCreateNewAdventure = (event) => {
		event.preventDefault()

		if (!adventureAddState) {
			return
		}

		const newAdventure = {
			id: 'waiting',
			adventure_name: 'New Adventure',
			images: [],
			coordinates: {
				lng: event.lngLat.lng,
				lat: event.lngLat.lat
			}
		}

		setAllAdventures((currentAdventures) => [...currentAdventures, newAdventure])
		setCurrentAdventure(newAdventure)

		openCard(CARD_STATES.adventures)
		setIsEditable(true)
		setAdventureAddState(false)
	}

	const viewMore = ({ popupInfo, setPopupInfo }) => {
		setCurrentAdventure(popupInfo)
		setPopupInfo(null)
		openCard(CARD_STATES.adventures)
	}

	return {
		handleCreateNewAdventure,
		viewMore
	}
}
