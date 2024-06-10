import {
	useAdventureStateContext,
	useDebounce,
	useManipulateFlows,
	useSaveAdventure,
	useTokenStateContext,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'
import * as turf from '@turf/turf'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from 'react'
import { icons } from 'Images/Activities/IconMap'
import { useNavigate, useParams } from 'react-router-dom'
import { adventurePathColor, parseZoneAdventures, useCreateNewAdventure } from './utils'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

export const useMapboxHooks = (mapRef, mapContainerRef) => {
	const {
		startPosition,
		allAdventures,
		globalAdventureType,
		currentAdventure,
		isPathEditOn,
		adventureAddState,
		matchPath
	} = useAdventureStateContext()
	const { allZones, currentZone } = useZoneStateContext()
	const { mapboxStyleKey, mapboxToken } = useTokenStateContext()
	const { updateStartPosition, toggleEnableAddPath } = useManipulateFlows()
	const { handleCreateNewAdventure } = useCreateNewAdventure()
	const { updatePath } = useSaveAdventure()
	const { adventureId, zoneId } = useParams()
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
		if (mapRef.current || !startPosition || !allAdventures || styleLoaded || !allZones) return

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
	}, [startPosition, allAdventures, allZones])

	// new globalAdventureType
	useEffect(() => {
		if (!mapRef.current || !globalAdventureType || !allZones || !styleLoaded) return

		if (currentAdventure || currentZone) return

		addZonesLayer(
			mapRef.current,
			allZones?.[globalAdventureType] ?? { type: 'FeatureCollection', features: [] }
		)
		addLinesLayer(mapRef.current, allAdventures?.[globalAdventureType]?.lines)
		addPointsLayer(mapRef.current, allAdventures?.[globalAdventureType]?.points)
		addPathLayer(mapRef.current, [])
		removeParentIconLayer(mapRef.current)

		mapRef.current.flyTo({
			center: [startPosition.lng, startPosition.lat],
			zoom: 13
		})

		mapRef.current.setLayoutProperty('zones-layer', 'icon-image', globalAdventureType)
	}, [globalAdventureType, allZones, styleLoaded, allAdventures])

	// show/hide cursor layer
	useEffect(() => {
		if (!mapRef.current) return
		if (adventureAddState) {
			addCursorLayer(mapRef.current)
		} else {
			removeCursorLayer(mapRef.current)
		}

		return () => {
			removeCursorLayer(mapRef.current)
		}
	}, [adventureAddState])

	// new current adventure or current zone
	useEffect(() => {
		if (!mapRef.current || !styleLoaded) return

		// if the current item is an adventure
		if (adventureId !== undefined) {
			// if the current adventure has a path, fit bounds to the path
			// show just the adventure, either point for climb
			// or line otherwise

			addZonesLayer(mapRef.current, null)
			addLinesLayer(mapRef.current, null)
			addParentIconLayer(mapRef.current, null)

			if (currentAdventure.path?.length) {
				const bounds = new mapboxgl.LngLatBounds()
				currentAdventure.path.forEach((point) => {
					bounds.extend(point)
				})

				mapRef.current.fitBounds(bounds, {
					padding: { top: 100, bottom: 200, left: 34 * 16, right: 50 },
					maxZoom: 19
				})

				addPathLayer(mapRef.current, currentAdventure.path)
				addPointsLayer(mapRef.current, null)
			} else {
				mapRef.current.flyTo({
					center: [currentAdventure.coordinates.lng - 0.001, currentAdventure.coordinates.lat],
					zoom: 16
				})

				addPointsLayer(mapRef.current, {
					type: 'FeatureCollection',
					features: [
						{
							geometry: {
								type: 'Point',
								coordinates: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat]
							}
						}
					]
				})

				if (mapRef.current.getLayer('adventure-path-layer')) {
					mapRef.current.removeLayer('adventure-path-layer')
					mapRef.current.removeSource('adventure-path')
				}
			}
		} else if (zoneId !== undefined) {
			// all the sub-zones should be points
			// all the adventure should be lines
			const { lines, points } = parseZoneAdventures(currentZone.adventures)

			addPathLayer(mapRef.current, [])

			const mapZones = {
				type: 'FeatureCollection',
				features: currentZone.zones.map((zone) => ({
					type: 'Feature',
					properties: {
						adventureType: zone.adventure_type,
						zoneName: zone.zone_name
					},
					geometry: {
						type: 'Point',
						coordinates: [zone.coordinates.lng, zone.coordinates.lat]
					},
					id: zone.zone_id
				}))
			}

			addParentIconLayer(mapRef.current, {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [currentZone.coordinates.lng, currentZone.coordinates.lat]
				},
				id: currentZone.id
			})

			if (mapZones.features.length > 1 || currentZone.adventures.length) {
				addZonesLayer(mapRef.current, mapZones)
				addLinesLayer(mapRef.current, lines)
				addPointsLayer(mapRef.current, points)

				const bounds = new mapboxgl.LngLatBounds()
				mapZones.features?.forEach((zone) => bounds.extend(zone.geometry.coordinates))

				currentZone.adventures.forEach((adventure) =>
					bounds.extend([adventure.coordinates.lng, adventure.coordinates.lat])
				)
				bounds.extend([currentZone.coordinates.lng, currentZone.coordinates.lat])
				console.log(currentZone.adventures)
				mapRef.current.fitBounds(bounds, {
					padding: { top: 100, bottom: 200, left: 34 * 16, right: 50 },
					maxZoom: 19
				})
			} else {
				mapRef.current.flyTo({
					center: [currentZone.coordinates.lng - 0.001, currentZone.coordinates.lat],
					zoom: 16
				})
			}
		} else {
			// show all top-level zones again
			addZonesLayer(
				mapRef.current,
				allZones?.[globalAdventureType] ?? { type: 'FeatureCollection', features: [] }
			)
			addLinesLayer(mapRef.current, allAdventures?.[globalAdventureType]?.lines)
			addPointsLayer(mapRef.current, allAdventures?.[globalAdventureType]?.points)
			addParentIconLayer(mapRef.current, null)
			addPathLayer(mapRef.current, [])
		}
	}, [currentAdventure, currentZone, styleLoaded])

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
			center: [startPosition.lng, startPosition.lat],
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

		map.on('click', (event) => handleCreateNewAdventure(event))
	}

	const removeCursorLayer = (map) => {
		const cursorLayer = map.getLayer('cursor-layer')
		if (cursorLayer) {
			map.removeLayer('cursor-layer')
			map.removeSource('cursor')
		}
	}

	const addZonesLayer = (map, data, reset) => {
		const previousSource = map.getSource('zones')
		try {
			if (!previousSource || reset) {
				map.addSource('zones', {
					type: 'geojson',
					data: data ?? { type: 'FeatureCollection', features: [] }
				})

				map.addLayer({
					id: 'zones-layer',
					source: 'zones',
					type: 'symbol',
					layout: {
						'icon-image': globalAdventureType,
						'icon-size': 0.4
					}
				})

				map.on('click', 'zones-layer', (event) => {
					const zoneId = event.features[0].id
					navigate(`zone/${zoneId}`)
				})
			}
			if (previousSource) {
				previousSource.setData(data ?? { type: 'FeatureCollection', features: [] })
			}
		} catch (error) {
			console.error(error)
		}
	}

	const addPathLayer = (map, pathPoints, reset) => {
		const previousSource = map.getSource('adventure-path')
		try {
			if (!previousSource || reset) {
				map.addSource('adventure-path', {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: pathPoints ?? []
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
			if (previousSource) {
				previousSource.setData({
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: pathPoints ?? []
					}
				})

				map.setPaintProperty(
					'adventure-path-layer',
					'line-color',
					adventurePathColor(globalAdventureType ?? 'ski')
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const addLinesLayer = (map, data, reset) => {
		const previousSource = map.getSource('lines')

		try {
			if (!previousSource || reset) {
				map.addSource('lines', {
					type: 'geojson',
					data: data ?? { type: 'FeatureCollection', features: [] }
				})

				map.addLayer({
					id: 'lines-layer',
					source: 'lines',
					type: 'line',
					layout: {
						'line-join': 'round',
						'line-cap': 'round'
					},
					paint: {
						'line-color': ['get', 'color'],
						'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 6, 3.5]
					}
				})
				map.on('mousemove', 'lines-layer', (event) => {
					if (event.features.length > 0) {
						if (hoveredLine.current !== null) {
							map.setFeatureState({ source: 'lines', id: hoveredLine.current }, { hover: false })
						}
						hoveredLine.current = event.features[0].id
						map.setFeatureState({ source: 'lines', id: event.features[0].id }, { hover: true })
					}
				})
				map.on('mouseleave', 'lines-layer', () => {
					map.setFeatureState({ source: 'lines', id: hoveredLine.current }, { hover: false })
					hoveredLine.current = null
				})
				map.on('click', 'lines-layer', (event) => {
					const adventureId = event.features[0].id
					const adventureType = event.features[0].properties.adventureType

					navigate(`adventure/${adventureType}/${adventureId}`)
				})
			}
			if (previousSource) {
				previousSource.setData(data ?? { type: 'FeatureCollection', features: [] })
			}
		} catch (error) {
			console.error(error)
		}
	}

	const addParentIconLayer = (map, data, reset) => {
		const previousSource = map.getSource('parent')
		try {
			if (!previousSource || reset) {
				map.addSource('parent', {
					type: 'geojson',
					data: data ?? { type: 'Feature', geometry: { type: 'Point', coordinates: [] } }
				})

				map.addLayer({
					id: 'parent-layer',
					source: 'parent',
					type: 'symbol',
					layout: {
						'icon-image': `${globalAdventureType}-parent`,
						'icon-size': 0.4
					}
				})

				map.on('click', 'parent-layer', (event) => {
					map.flyTo({ center: event.features[0].geometry.coordinates, zoom: 13 })
				})
			}

			if (previousSource) {
				previousSource.setData(
					data ?? { type: 'Feature', geometry: { type: 'Point', coordinates: [] } }
				)
				map.setLayoutProperty('parent-layer', 'icon-image', `${globalAdventureType}-parent`)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const removeParentIconLayer = (map) => {
		if (map.getSource('parent')) {
			map.removeLayer('parent-layer')
			map.removeSource('parent')
		}
	}

	const addPointsLayer = (map, data, reset) => {
		const previousSource = map.getSource('points')
		try {
			if (!previousSource || reset) {
				if (map.getSource('points')) {
					map.removeLayer('points-layer')
					map.removeSource('points')
				}

				map.addSource('points', {
					type: 'geojson',
					data: data ?? { type: 'FeatureCollection', features: [] }
				})

				map.addLayer({
					id: 'points-layer',
					source: 'points',
					type: 'symbol',
					layout: {
						'icon-image': `${globalAdventureType}-activity`,
						'icon-size': 0.4
					}
				})

				map.on('click', 'points-layer', (event) => {
					const adventureId = event.features[0].id
					const adventureType = event.features[0].properties.adventureType

					navigate(`adventure/${adventureType}/${adventureId}`)
				})
			}

			if (previousSource) {
				previousSource.setData(data ?? { type: 'FeatureCollection', features: [] })
				map.setLayoutProperty('points-layer', 'icon-image', `${globalAdventureType}-activity`)
			}
		} catch (error) {
			console.error(error)
		}
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

		setStyleLoaded(true)
	}

	const handleMapMove = (map) => {
		establishNewStartPosition({
			lat: map.getCenter().lat,
			lng: map.getCenter().lng,
			zoom: map.getZoom()
		})
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
