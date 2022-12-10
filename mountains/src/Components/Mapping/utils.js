import {
	CARD_TYPES,
	useAdventureStateContext,
	useCardStateContext,
	useGetAdventure
} from '../../Providers'
import { createNewDefaultAdventure } from '../../Providers/utils'

export const useCreateNewAdventure = () => {
	const { adventureAddState, allAdventures, adventureDispatch } = useAdventureStateContext()
	const { cardDispatch } = useCardStateContext()
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

		adventureDispatch({
			type: 'newAdventurePanel',
			payload: { adventures: [...allAdventures, newAdventure], currentAdventure: newAdventure }
		})

		cardDispatch({ type: 'openCard', payload: CARD_TYPES.adventures })
		adventureDispatch({ type: 'toggleAdventureEditable' })
	}

	const viewMore = ({ id, boundingBox }) => {
		adventureDispatch({ type: 'boundingBox', payload: boundingBox })

		return getAdventure({ id }).then(() =>
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.adventures })
		)
	}

	return {
		handleCreateNewAdventure,
		viewMore
	}
}
