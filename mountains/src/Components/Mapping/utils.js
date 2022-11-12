import {
	CARD_TYPES,
	useAdventureEditContext,
	useCardStateContext,
	useGetAdventure
} from '../../Providers'
import { createNewDefaultAdventure } from '../../Providers/utils'

export const useCreateNewAdventure = () => {
	const {
		adventureAddState,
		setAllAdventures,
		setCurrentAdventure,
		setIsEditable,
		setAdventureAddState,
		setCurrentBoundingBox
	} = useAdventureEditContext()
	const { openCard } = useCardStateContext()
	const { getAdventure } = useGetAdventure()

	const handleCreateNewAdventure = (event) => {
		event.preventDefault()

		if (!adventureAddState) {
			return
		}

		const newAdventure = createNewDefaultAdventure({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat
		})

		setAllAdventures((currentAdventures) => [...currentAdventures, newAdventure])
		setCurrentAdventure(newAdventure)

		openCard(CARD_TYPES.adventures)
		setIsEditable(true)
		setAdventureAddState(false)
	}

	const viewMore = ({ id, boundingBox }) => {
		setCurrentBoundingBox(boundingBox)
		return getAdventure({ id }).then(() => {
			openCard(CARD_TYPES.adventures)
		})
	}

	return {
		handleCreateNewAdventure,
		viewMore
	}
}
