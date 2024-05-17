import {
	useAdventureStateContext,
	useDebounce,
	useManipulateFlows,
	useSaveAdventure,
	useTokenStateContext
} from '@amaclean2/sundaypeak-treewells'
import * as turf from '@turf/turf'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from 'react'
import { icons } from 'Images/Activities/IconMap'
import { useNavigate } from 'react-router-dom'
import { adventurePathColor, useCreateNewAdventure } from './utils'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

export const useMapboxHooks = (mapRef, mapContainerRef) => {
	const {
		startPosition,
		allAdventures,
		globalAdventureType,
		currentAdventure,
		isPathEditOn,
		adventureAddState
	} = useAdventureStateContext()
	const { mapboxStyleKey, mapboxToken } = useTokenStateContext()
	const { matchPath } = useAdventureStateContext()
	const { updateStartPosition, toggleEnableAddPath } = useManipulateFlows()
	const { handleCreateNewAdventure } = useCreateNewAdventure()
	const { updatePath } = useSaveAdventure()
	const navigate = useNavigate()
	const localMatch = useRef(matchPath)
	const hoveredLine = useRef(null)

	const [styleLoaded, setStyleLoaded] = useState(false)
	const [drawControl, setDrawControl] = useState(null)

	const establishNewStartPosition = useDebounce((mapPosition) => updateStartPosition(mapPosition))

	// handle securing the state of variables
	useEffect(() => {
		localMatch.current = matchPath
	}, [matchPath])

	// initialize map
	useEffect(() => {
		if (mapRef.current || !startPosition || !allAdventures || styleLoaded) return

		mapRef.current = initializeMap()

		mapRef.current.on('load', () => loadIcons(mapRef.current))
		mapRef.current.on('style.load', () => loadLayers(mapRef.current))
		mapRef.current.on('move', () => handleMapMove(mapRef.current))
		mapRef.current.on('mousemove', (event) => {
			const cursorSource = mapRef.current.getSource('cursor')
			if (cursorSource) {
				return cursorSource.setData({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [event.lngLat.lng, event.lngLat.lat]
					}
				})
			}
		})

		return () => {
			mapRef.current.off('style.load', () => loadLayers(mapRef.current))
			mapRef.current.off('move', () => handleMapMove(mapRef.current))
		}
	}, [startPosition, allAdventures])

	// new globalAdventureType
	useEffect(() => {
		if (!mapRef.current || !globalAdventureType || !allAdventures || !styleLoaded) return

		let adventureData = allAdventures[globalAdventureType] ?? []
		if (Array.isArray(adventureData) && !adventureData.length) {
			adventureData = { type: 'FeatureCollection', features: [] }
		}

		mapRef.current.getSource('adventures')?.setData(adventureData)
		mapRef.current.setLayoutProperty('adventures-layer', 'icon-image', globalAdventureType)

		if (['ski', 'skiApproach'].includes(globalAdventureType)) {
			addSkiApproachLayer(mapRef.current)
		} else if (mapRef.current.getSource('ski-approach')) {
			mapRef.current.removeLayer('ski-approach-layer')
			mapRef.current.removeSource('ski-approach')
		}
	}, [globalAdventureType, allAdventures, styleLoaded])

	useEffect(() => {
		if (!mapRef.current) return
		if (adventureAddState) {
			addCursorLayer(mapRef.current)
		} else {
			removeCursorLayer(mapRef.current)
		}
	}, [adventureAddState])

	// new current adventure
	useEffect(() => {
		if (!mapRef.current || !styleLoaded) return

		if (currentAdventure?.path?.length) {
			const bounds = new mapboxgl.LngLatBounds(currentAdventure.path[0], currentAdventure.path[0])

			for (const p of currentAdventure.path) {
				bounds.extend(p)
			}
			mapRef.current.fitBounds(bounds, {
				padding: { top: 100, bottom: 200, left: 34 * 16, right: 50 },
				maxZoom: 19
			})
		} else if (currentAdventure?.id) {
			mapRef.current.flyTo({
				center: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat],
				zoom: 16
			})
		}

		if (!currentAdventure?.path?.length) {
			if (mapRef.current.getLayer('adventure-path-layer')) {
				mapRef.current.removeLayer('adventure-path-layer')
				mapRef.current.removeSource('adventure-path')
			}
		}

		if (currentAdventure?.adventure_type !== 'skiApproach') addPathLayer(mapRef.current)
	}, [currentAdventure, styleLoaded])

	// handles the drawControl layer
	useEffect(() => {
		if (isPathEditOn) {
			enableDrawControl(mapRef.current)
		} else {
			disableDrawControl(mapRef.current)
		}
	}, [isPathEditOn])

	const initializeMap = () => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: `${mapboxStyleKey}?optimize=true`,
			center: [startPosition.longitude, startPosition.latitude],
			zoom: startPosition.zoom
		})

		map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
		map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right')
		map.addControl(new mapboxgl.GeolocateControl(), 'bottom-right')

		return map
	}

	const addCursorLayer = (map) => {
		if (map.getSource('cursor')) return

		map.addSource('cursor', {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [3, 4]
				}
			}
		})

		map.addLayer({
			id: 'cursor-layer',
			source: 'cursor',
			type: 'symbol',
			layout: {
				'icon-image': globalAdventureType,
				'icon-size': 0.4
			}
		})

		map.on('click', 'cursor-layer', (event) => handleCreateNewAdventure(event))
	}

	const removeCursorLayer = (map) => {
		const cursorLayer = map.getLayer('cursor-layer')
		if (cursorLayer) {
			map.removeLayer('cursor-layer')
			map.removeSource('cursor')
		}
	}

	const addAdventuresLayer = (map) => {
		map.addSource('adventures', {
			type: 'geojson',
			data: allAdventures[globalAdventureType]
		})

		map.addLayer({
			id: 'adventures-layer',
			source: 'adventures',
			type: 'symbol',
			layout: {
				'icon-image': globalAdventureType,
				'icon-size': 0.4
			}
		})

		map.on('click', 'adventures-layer', (event) => handleAdventuresClick(event, map))
	}

	const addPathLayer = (map, newPath) => {
		const path = newPath ?? currentAdventure?.path ?? []
		const pathSource = map.getSource('adventure-path')
		if (pathSource) {
			pathSource.setData({
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: path
				}
			})

			map.setPaintProperty(
				'adventure-path-layer',
				'line-color',
				adventurePathColor(globalAdventureType ?? 'ski')
			)
		} else {
			map.addSource('adventure-path', {
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: path
					}
				}
			})

			map.addLayer({
				id: 'adventure-path-layer',
				source: 'adventure-path',
				type: 'line',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': adventurePathColor(globalAdventureType ?? 'ski'),
					'line-width': 5
				}
			})
		}
	}

	const addSkiApproachLayer = (map) => {
		if (!allAdventures?.skiApproach?.features?.length) return

		const skiApproachSource = map.getSource('ski-approach')
		if (skiApproachSource) {
			skiApproachSource.setData(allAdventures.skiApproach)
		} else {
			map.addSource('ski-approach', {
				type: 'geojson',
				data: allAdventures.skiApproach
			})

			map.addLayer({
				id: 'ski-approach-layer',
				source: 'ski-approach',
				type: 'line',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						'#e40',
						adventurePathColor('skiApproach')
					],
					'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 5, 4]
				}
			})
		}

		map.on('mousemove', 'ski-approach-layer', (event) => {
			if (event.features.length > 0) {
				if (hoveredLine.current !== null) {
					map.setFeatureState({ source: 'ski-approach', id: hoveredLine.current }, { hover: false })
				}
				hoveredLine.current = event.features[0].id
				map.setFeatureState({ source: 'ski-approach', id: event.features[0].id }, { hover: true })
			}
		})
		map.on('mouseleave', 'ski-approach-layer', () => {
			map.setFeatureState({ source: 'ski-approach', id: hoveredLine.current }, { hover: false })
			hoveredLine.current = null
		})
		map.on('click', 'ski-approach-layer', (event) => handleAdventuresClick(event, map))
	}

	const loadIcons = (map) => {
		icons.forEach(([icon, iconName]) => {
			map.loadImage(icon, (error, image) => {
				if (error) console.log(error)

				if (!map.hasImage(iconName)) {
					map.addImage(iconName, image)
				}
			})
		})
	}

	const loadLayers = (map) => {
		map.addSource('mapbox-dem', {
			type: 'raster-dem',
			url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
			tileSize: 512,
			maxzoom: 20
		})

		map.setTerrain({ source: 'mapbox-dem' })

		addAdventuresLayer(map)
		setStyleLoaded(true)
	}

	const handleMapMove = (map) => {
		establishNewStartPosition({
			latitude: map.getCenter().lat,
			longitude: map.getCenter().lng,
			zoom: map.getZoom()
		})
	}

	const handleAdventuresClick = (event) => {
		const adventureId = event.features[0].properties.id
		const adventureType = event.features[0].properties.adventure_type

		navigate(`adventure/${adventureType}/${adventureId}`)
	}

	const enableDrawControl = (map) => {
		if (drawControl) return

		const draw = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				line_string: true,
				trash: true
			},
			styles: [
				{
					id: 'gl-draw-line',
					type: 'line',
					filter: ['all', ['==', '$type', 'LineString']],
					layout: {
						'line-cap': 'round',
						'line-join': 'round'
					},
					paint: {
						'line-color': '#438EE4',
						'line-width': 4,
						'line-opacity': 0.7
					}
				},
				{
					id: 'gl-draw-vertex-outline',
					type: 'circle',
					filter: [
						'all',
						['==', 'meta', 'vertex'],
						['==', '$type', 'Point'],
						['!=', 'mode', 'static']
					],
					paint: {
						'circle-radius': 8,
						'circle-color': '#FFF'
					}
				},
				{
					id: 'gl-draw-vertex-selected',
					type: 'circle',
					filter: [
						'all',
						['==', 'meta', 'vertex'],
						['==', '$type', 'Point'],
						['!=', 'mode', 'static']
					],
					paint: {
						'circle-radius': 6,
						'circle-color': '#438EE4'
					}
				},
				{
					id: 'gl-draw-point-midpoint',
					type: 'circle',
					filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
					paint: {
						'circle-radius': 6,
						'circle-color': '#438EE4'
					}
				}
			]
		})

		map.addControl(draw, 'bottom-right')
		setDrawControl(draw)

		if (currentAdventure.points?.length) {
			draw.add({ coordinates: currentAdventure.points, type: 'LineString' })
		}

		map.on('draw.create', (event) => handleRouteUpdate(event, map))
		map.on('draw.update', (event) => handleRouteUpdate(event, map))
	}

	const disableDrawControl = (map) => {
		if (drawControl) {
			map.removeControl(drawControl)
			setDrawControl(null)
		}
	}

	const handleRouteUpdate = async (event, map) => {
		toggleEnableAddPath(true)

		let newFeature = event.features[0]
		let editPoints = newFeature.geometry.coordinates
		if (localMatch.current) {
			const matched = await handlePathMatch(newFeature)
			if (matched?.geometry.coordinates?.length) {
				// draw the new path
				addPathLayer(map, matched.geometry.coordinates)

				newFeature.geometry.coordinates = matched.geometry.coordinates
			}
		}

		let oldDistance = 0,
			lastPoint = null,
			maxElevation = -Infinity,
			minElevation = Infinity

		const elevations = []
		const distanceInterval = 0.1 // distance in km
		const chunks = turf.lineChunk(newFeature, distanceInterval).features

		chunks.forEach((lineStringFeature, featureIdx) => {
			const lineStringCoordinates = lineStringFeature.geometry.coordinates
			lineStringCoordinates.forEach((point, pointIdx) => {
				let distance
				if (!(pointIdx || featureIdx)) {
					distance = 0
				} else {
					distance = turf.distance(point, lastPoint, { units: 'miles' }) + oldDistance
				}

				oldDistance = distance
				lastPoint = point

				const elevation =
					map.queryTerrainElevation({
						lng: point[0],
						lat: point[1]
					}) * 3.28

				maxElevation = Math.max(elevation, maxElevation).toFixed(0)
				minElevation = Math.min(elevation, minElevation).toFixed(0)

				elevations.push([elevation, distance])
			})
		})

		updatePath({
			path: newFeature.geometry.coordinates,
			points: editPoints,
			elevations,
			maxEl: maxElevation,
			minEl: minElevation
		})
	}

	const handlePathMatch = async (feature) => {
		// calls the matchPath api
		const query = await fetch(
			`https://api.mapbox.com/matching/v5/mapbox/walking/${feature.geometry.coordinates.join(
				';'
			)}?geometries=geojson&radiuses=${feature.geometry.coordinates
				.map(() => 40)
				.join(';')}&overview=full&access_token=${mapboxToken}`,
			{ method: 'GET' }
		)
		const response = await query.json()

		if (response.code !== 'Ok') {
			console.log(
				`${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
			)
		}

		if (response.matchings?.length) {
			return response.matchings[0]
		} else {
			console.log('no matchings found')
			return { geometry: { coordinates: [] } }
		}
	}
}
