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

export const adventurePathColor = (adventure_type = 'ski') => {
	switch (adventure_type) {
		case 'ski':
			return '#38e'
		case 'hike':
			return '#e53'
		case 'bike':
			return '#3a3'
	}
}
