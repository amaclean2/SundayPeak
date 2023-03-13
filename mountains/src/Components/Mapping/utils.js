import { useNavigate } from 'react-router-dom'

import { useAdventureStateContext } from 'Hooks/Providers'
import { useGetAdventure, useGetAdventures } from 'Hooks'

export const useCreateNewAdventure = () => {
	const { adventureAddState, adventureDispatch } = useAdventureStateContext()
	const { createNewDefaultAdventure } = useGetAdventures()
	const { getAdventure } = useGetAdventure()
	const navigate = useNavigate()

	const handleCreateNewAdventure = (event) => {
		event.preventDefault()

		if (!adventureAddState) {
			return
		}

		return createNewDefaultAdventure({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat
		}).then(({ adventure, all_adventures }) => {
			adventureDispatch({
				type: 'openNewAdventureView',
				payload: {
					adventures: all_adventures,
					currentAdventure: adventure
				}
			})
			return navigate(`/adventure/edit/${adventure.adventure_type}/${adventure.id}`)
		})
	}

	const viewMore = ({ id, type }) => {
		return getAdventure({ id }).then(() => navigate(`/adventure/${type}/${id}`))
	}

	return {
		handleCreateNewAdventure,
		viewMore
	}
}
