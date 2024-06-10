import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useSaveAdventure,
	useSaveZones,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'
import { useEffect, useRef } from 'react'

export const useCreateNewAdventure = () => {
	const { adventureAddState, currentAdventure, zoneAdd } = useAdventureStateContext()
	const { currentZone } = useZoneStateContext()
	const {
		createNewDefaultAdventure,
		editCoordinates: editAdventureCoordinates,
		toggleAdventureAddState,
		toggleZoneAdd
	} = useSaveAdventure()
	const {
		editCoordinates: editZoneCoordinates,
		addAdventureToZone,
		addChildZone,
		createNewDefaultZone
	} = useSaveZones()
	const navigate = useNavigate()

	const adventureAddStateRef = useRef(adventureAddState)
	const currentAdventureRef = useRef(currentAdventure)
	const currentZoneRef = useRef(currentZone)

	useEffect(() => {
		adventureAddStateRef.current = adventureAddState
		currentAdventureRef.current = currentAdventure
		currentZoneRef.current = currentZone
	}, [adventureAddState, currentAdventure, currentZone])

	// wrapping this in a useCallback preserves the state values so that they don't
	// get tied to the calling function
	const handleCreateNewAdventure = async (event) => {
		event.preventDefault()

		if (!adventureAddStateRef.current) {
			return
		}

		if (!zoneAdd) {
			if (currentAdventureRef.current) {
				editAdventureCoordinates({ lat: event.lngLat.lat, lng: event.lngLat.lng })
				toggleAdventureAddState(false)
				return navigate(
					`/adventure/${currentAdventureRef.current.adventure_type}/${currentAdventureRef.current.id}`
				)
			} else if (currentZoneRef.current) {
				editZoneCoordinates({ lat: event.lngLat.lat, lng: event.lngLat.lng })
				toggleAdventureAddState(false)
				return navigate(`/zone/${currentZoneRef.current.id}`)
			}
		}

		try {
			if (adventureAddStateRef.current === 'adventure') {
				const adventure = await createNewDefaultAdventure(event.lngLat)
				if (zoneAdd) {
					await addAdventureToZone({ parentId: zoneAdd, adventureId: adventure.id })
					toggleZoneAdd()
				}
				toggleAdventureAddState(false)
				return navigate(`/adventure/edit/${adventure.adventure_type}/${adventure.id}`)
			} else {
				const zone = await createNewDefaultZone(event.lngLat)
				console.log({ zone })
				if (zoneAdd) {
					await addChildZone({ parentId: zoneAdd, childId: zone.id })
					toggleZoneAdd()
				}
				toggleAdventureAddState(false)
				return navigate(`/zone/edit/${zone.id}`)
			}
		} catch (error) {
			console.log('failed to create a new default adventure or zone')
			console.error(error)
		}
	}

	return {
		handleCreateNewAdventure
	}
}

export const adventurePathColor = (adventureType = 'ski') => {
	const colors = {
		ski: '#38e',
		hike: '#e53',
		climb: '#ccc',
		bike: '#3a3',
		skiApproach: '#d70'
	}

	return colors[adventureType]
}

export const parseZoneAdventures = (zoneAdventures) => {
	if (!zoneAdventures?.length)
		return {
			lines: { type: 'FeatureCollection', features: [] },
			points: { type: 'FeatureCollection', features: [] }
		}

	let pointAdventures = []
	let lineAdventures = []

	for (let adventure of zoneAdventures) {
		if ([null, undefined].includes(adventure.path) || adventure.path.length === 0) {
			pointAdventures.push(adventure)
		} else {
			lineAdventures.push(adventure)
		}
	}

	return {
		points: {
			type: 'FeatureCollection',
			features: pointAdventures.map((point) => ({
				type: 'Feature',
				id: point.adventure_id,
				properties: {
					adventureName: point.adventure_name,
					adventureType: point.adventure_type,
					color: adventurePathColor(point.adventure_type)
				},
				geometry: { type: 'Point', coordinates: [point.coordinates.lng, point.coordinates.lat] }
			}))
		},
		lines: {
			type: 'FeatureCollection',
			features: lineAdventures.map((line) => ({
				type: 'Feature',
				id: line.adventure_id,
				properties: {
					adventureName: line.adventure_name,
					adventureType: line.adventure_type,
					color: adventurePathColor(line.adventure_type)
				},
				geometry: { type: 'LineString', coordinates: line.path }
			}))
		}
	}
}
