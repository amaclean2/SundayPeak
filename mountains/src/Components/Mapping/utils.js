import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

export const useCreateNewAdventure = () => {
	const { adventureAddState } = useAdventureStateContext()
	const { getAdventure } = useGetAdventures()
	const { createNewDefaultAdventure } = useSaveAdventure()
	const navigate = useNavigate()

	const handleCreateNewAdventure = (event) => {
		event.preventDefault()

		if (!adventureAddState) {
			return
		}

		return createNewDefaultAdventure({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat
		}).then((adventure) => navigate(`/adventure/edit/${adventure.adventure_type}/${adventure.id}`))
	}

	const viewMore = ({ id, type }) => {
		return getAdventure({ id }).then(() => navigate(`/adventure/${type}/${id}`))
	}

	return {
		handleCreateNewAdventure,
		viewMore
	}
}
