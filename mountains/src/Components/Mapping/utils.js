import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveAdventure,
	useTokenStateContext
} from '@amaclean2/sundaypeak-treewells'
import { useEffect, useRef } from 'react'
import * as turf from '@turf/turf'

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
		case 'skiApproach':
			return '#d70'
	}
}

export const useRouteHandling = () => {
	const { mapboxToken } = useTokenStateContext()
	const { updatePath } = useSaveAdventure()
	const { matchPath } = useAdventureStateContext()
	const localMatch = useRef(matchPath)

	useEffect(() => {
		localMatch.current = matchPath
	}, [matchPath])

	const updateRoute = (event, mapRef) => {
		const profile = 'walking'
		// features is an array of geojson lineString 'Feature's
		const lastFeature = event.features.length - 1
		const coordinates = event.features[lastFeature].geometry.coordinates

		// matchPath is a toggle that tells if the user wants to match the path to a given road or not
		if (!localMatch.current) {
			const options = { units: 'miles' }
			let oldDistance = 0
			const elevations = coordinates.map((point, idx, elevationPoints) => {
				let distance
				if (idx === 0) {
					distance = 0
				} else {
					distance = turf.distance(point, elevationPoints[idx - 1], options) + oldDistance
					oldDistance = distance
				}
				return [Math.round(mapRef.current?.queryTerrainElevation(point) * 100) / 100, distance]
			})

			return updatePath(coordinates, elevations)
		}

		const newCoordinates = coordinates.join(';')
		const radius = coordinates.map(() => 40)
		const radiuses = radius.join(';')

		getMatch(newCoordinates, radiuses, profile, mapRef)
	}

	const getMatch = async (coordinates, radiuses, profile, mapRef) => {
		try {
			const query = await fetch(
				`https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&overview=full&access_token=${mapboxToken}`,
				{ method: 'GET' }
			)
			const response = await query.json()

			if (response.code !== 'Ok') {
				throw `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
			}

			const resultCoordinates = response.matchings[0].geometry.coordinates

			const options = { units: 'miles' }
			let oldDistance = 0
			const elevations = resultCoordinates.map((point, idx, elevationPoints) => {
				let distance
				if (idx === 0) {
					distance = 0
				} else {
					distance =
						Math.round(
							(turf.distance(point, elevationPoints[idx - 1], options) + oldDistance) * 10000
						) / 10000

					oldDistance = distance
				}
				return [Math.round(mapRef.current?.queryTerrainElevation(point) * 100) / 100, distance]
			})

			updatePath(resultCoordinates, elevations)
		} catch (error) {
			console.log({ error })
		}
	}

	return {
		updateRoute
	}
}

/**
 *    if (isPathEditOn) {
		  	updatePath([event.lngLat.lng, event.lngLat.lat])
		  	return
		  }

			if (!event.features.length) return
			const adventureType = event.features[0].properties.adventure_type
			const adventureId = event.features[0].properties.id

			navigate(`adventure/${adventureType}/${adventureId}`)
 */
