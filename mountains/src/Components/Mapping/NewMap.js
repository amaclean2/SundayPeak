import mapboxgl from 'mapbox-gl'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAdventureStateContext, useTokenStateContext } from 'sundaypeak-treewells'

import { useCreateNewAdventure } from './utils'

import 'mapbox-gl/dist/mapbox-gl.css'

const NewMap = () => {
	const { mapboxToken, mapboxStyleKey } = useTokenStateContext()
	const { startPosition, allAdventures, currentAdventure } = useAdventureStateContext()
	const { handleCreateNewAdventure } = useCreateNewAdventure()
	const navigate = useNavigate()

	mapboxgl.accessToken = mapboxToken

	const mapContainer = useRef()
	const map = useRef()

	useEffect(() => {
		if (map.current) return

		if (mapboxStyleKey && mapboxToken && allAdventures) {
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: mapboxStyleKey,
				center: [startPosition.longitude, startPosition.latitude],
				zoom: startPosition.zoom
			})

			map.current.on('move', () => {
				// console.log('moved')
			})

			map.current.on('dblclick', (event) => handleCreateNewAdventure(event))

			map.current.on('load', () => {
				map.current.loadImage(skier, (error, image) => {
					if (error) {
						console.log(error)
						return
					}

					map.current.addImage('skier-icon', image)
					map.current.addSource('adventures', {
						type: 'geojson',
						data: allAdventures
					})

					map.current.addLayer({
						id: 'adventure-icons',
						type: 'symbol',
						source: 'adventures',
						layout: {
							'icon-image': 'skier-icon',
							'icon-size': 0.4
						}
					})

					map.current.on('click', 'adventure-icons', (event) => {
						map.current.flyTo({
							center: event.features[0].geometry.coordinates,
							zoom: 14
						})
						navigate(
							`/adventure/${event.features[0].properties.adventure_type}/${event.features[0].properties.id}`
						)
					})
				})
			})
		}
	}, [mapboxToken, mapboxStyleKey, allAdventures])

	useEffect(() => {
		if (!map.current || !currentAdventure) {
			return
		}

		map.current.flyTo({
			center: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat],
			zoom: 14
		})
	}, [currentAdventure?.id])

	return (
		<div
			ref={mapContainer}
			style={{ width: '100vw', height: '100vh', top: 0, left: 0, position: 'fixed' }}
		/>
	)
}

export default NewMap
