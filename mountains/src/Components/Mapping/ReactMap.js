import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Map, {
	FullscreenControl,
	GeolocateControl,
	Layer,
	NavigationControl,
	Source
} from 'react-map-gl'
import {
	useAdventureStateContext,
	useDebounce,
	useManipulateFlows,
	useTokenStateContext,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

import { adventurePathColor, useCreateNewAdventure } from './utils'

import skier from 'Images/Activities/SkierIcon.png'
import hiker from 'Images/Activities/HikerIcon.png'
import climber from 'Images/Activities/ClimberIcon.png'

import './styles.css'

const ReactMap = () => {
	// mapRef is used to access the map dom element
	const mapRef = useRef()

	const getLocateControlRef = useCallback((ref) => {
		// This jumps to the user's location if active.
		// I'm not sure what I want to do with this
		if (ref) ref.trigger()
	}, [])

	const {
		allAdventures,
		startPosition,
		currentAdventure,
		globalAdventureType,
		isPathEditOn,
		workingPath,
		adventureAddState
	} = useAdventureStateContext()
	const { mapboxToken, mapboxStyleKey } = useTokenStateContext()
	const { handleCreateNewAdventure } = useCreateNewAdventure()
	const { updatePath } = useSaveAdventure()
	const { updateStartPosition } = useManipulateFlows()
	const navigate = useNavigate()

	const onLoad = () => {
		// this is a reference to the map dom element
		const map = mapRef.current?.getMap()

		const icons = [
			[skier, 'ski'],
			[hiker, 'hike'],
			[climber, 'climb']
		]

		// if there's a current adventure and the map is loading, fly to that adventure
		if (currentAdventure) {
			mapRef.current.flyTo({
				center: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat],
				zoom: 16
			})
		}

		icons.forEach(([icon, iconName]) => {
			map.loadImage(icon, (error, image) => {
				if (error) {
					throw error
				}
				if (!map.hasImage(iconName)) {
					map.addImage(iconName, image)
				}
			})
		})
	}

	const establishNewStartPosition = useDebounce((mapPosition) => updateStartPosition(mapPosition))

	const onMove = (event) => {
		// set the new start position
		establishNewStartPosition({
			latitude: event.viewState.latitude,
			longitude: event.viewState.longitude,
			zoom: 12
		})
	}

	useEffect(() => {
		if (currentAdventure === null || !mapRef.current) {
			return
		}

		mapRef.current.flyTo({
			center: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat],
			zoom: 16
		})
	}, [currentAdventure?.id, mapRef.current])

	if (!(allAdventures && mapboxToken && mapboxStyleKey)) {
		return (
			<div
				className={'map-container placeholder'}
				data-testid={'map-container-placeholder'}
			/>
		)
	}

	// extracted the props for the <Map /> component to here so it doesn't clutter the jsx
	const mapProps = {
		ref: mapRef,
		reuseMaps: true,
		mapboxAccessToken: mapboxToken,
		mapStyle: `${mapboxStyleKey}?optimize=true`,
		initialViewState: startPosition,
		maxPitch: 0,
		minZoom: 3,
		onDblClick: handleCreateNewAdventure,
		onClick: (event) => {
			if (isPathEditOn) {
				updatePath([event.lngLat.lng, event.lngLat.lat])
				return
			}

			if (!event.features.length) return
			const adventureType = event.features[0].properties.adventure_type
			const adventureId = event.features[0].properties.id

			navigate(`adventure/${adventureType}/${adventureId}`)
		},
		onLoad,
		onMove
	}

	return (
		<div
			className={'map-container'}
			data-testid='map-container'
			style={{ width: '100vw', height: '100vh', top: 0, left: 0, position: 'fixed' }}
		>
			<Map
				{...mapProps}
				interactiveLayerIds={['adventure-icons', 'sky']}
			>
				<NavigationControl
					showCompass
					position={'bottom-right'}
				/>
				<GeolocateControl
					ref={getLocateControlRef}
					position={'bottom-right'}
				/>
				<FullscreenControl position={'bottom-right'} />
				<Source
					id='mapbox-dem'
					type='raster-dem'
					url='mapbox://mapbox.mapbox-terrain-dem-v1'
					tileSize={512}
					maxZoom={14}
				/>
				<Layer
					id={'sky'}
					type='sky'
					paint={{
						'sky-type': 'atmosphere',
						'sky-atmosphere-sun': [0.0, 0.0],
						'sky-atmosphere-sun-intensity': 15
					}}
				/>
				<Source
					type='geojson'
					data={{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: workingPath
						}
					}}
				>
					<Layer
						id={'adventure-path'}
						type={'line'}
						source={'current-adventure'}
						layout={{
							'line-join': 'round',
							'line-cap': 'round'
						}}
						paint={{
							'line-color': adventurePathColor(currentAdventure?.adventure_type ?? 'ski'),
							'line-width': 5
						}}
					/>
				</Source>
				<Source
					type='geojson'
					data={allAdventures}
				>
					<Layer
						id={'adventure-icons'}
						type={'symbol'}
						source={'adventures'}
						layout={{
							'icon-image': globalAdventureType,
							'icon-size': 0.4
						}}
					/>
				</Source>
			</Map>
		</div>
	)
}

export default ReactMap
