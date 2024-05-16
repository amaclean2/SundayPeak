import { useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useSaveAdventure } from '@amaclean2/sundaypeak-treewells'
import { useEffect, useRef } from 'react'

export const useCreateNewAdventure = () => {
	const { adventureAddState, currentAdventure } = useAdventureStateContext()
	const { createNewDefaultAdventure, editAdventure, editCoordinates, toggleAdventureAddState } =
		useSaveAdventure()
	const navigate = useNavigate()

	const adventureAddStateRef = useRef(adventureAddState)
	const currentAdventureRef = useRef(currentAdventure)
	useEffect(() => {
		adventureAddStateRef.current = adventureAddState
		currentAdventureRef.current = currentAdventure
	}, [adventureAddState, currentAdventure])

	// wrapping this in a useCallback preserves the state values so that they don't
	// get tied to the calling function
	const handleCreateNewAdventure = (event) => {
		event.preventDefault()

		if (!adventureAddStateRef.current) {
			return
		}

		if (currentAdventureRef.current) {
			editCoordinates({ lat: event.lngLat.lat, lng: event.lngLat.lng })
			return toggleAdventureAddState()
		}

		return createNewDefaultAdventure({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat
		}).then((adventure) => navigate(`/adventure/edit/${adventure.adventure_type}/${adventure.id}`))
	}

	return {
		handleCreateNewAdventure
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
		case 'skiApproach':
			return '#d70'
	}
}
