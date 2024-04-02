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
	useMessages,
	useTokenStateContext,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { adventurePathColor, useCreateNewAdventure, useRouteHandling } from './utils'
import DrawControl from './DrawControl'
import { icons } from 'Images/Activities/IconMap'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
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
		workingPath
	} = useAdventureStateContext()
	const { mapboxToken, mapboxStyleKey } = useTokenStateContext()
	const { handleCreateNewAdventure } = useCreateNewAdventure()
	const { updateStartPosition } = useManipulateFlows()
	const navigate = useNavigate()
	const { updateRoute } = useRouteHandling(mapRef)
	const { initiateConnection } = useMessages()
	const { loggedInUser } = useUserStateContext()

	const onLoad = () => {
		// this is a reference to the map DOM element
		const map = mapRef.current?.getMap()

		// if there's a current adventure and the map is loading, fly to that adventure

		icons.forEach(([icon, iconName]) => {
			map.loadImage(icon, (error, image) => {
				if (error) console.error(error)

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
		// initiate the websocket connection for messages
		// this page will always load first so this was as good of a place to put it as any
		if (loggedInUser?.id) {
			initiateConnection()
		}
	}, [loggedInUser?.id])

	useEffect(() => {
		if (currentAdventure === null || !mapRef.current) {
			return
		}

		if (currentAdventure.cameraBounds?.ne?.length && currentAdventure.cameraBounds?.sw?.length) {
			mapRef.current.fitBounds(
				[currentAdventure.cameraBounds.ne, currentAdventure.cameraBounds.sw],
				{
					offset: [100, 0],
					maxZoom: 15
				}
			)
		} else {
			mapRef.current.flyTo({
				center: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat],
				zoom: 15
			})
		}
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
		maxPitch: 85,
		minZoom: 3,
		terrain: { source: 'mapbox-dem', exaggeration: 1 },
		onDblClick: handleCreateNewAdventure,
		onClick: (event) => {
			if (!isPathEditOn) {
				if (!event.features.length) return

				const adventureType = event.features[0].properties.adventure_type
				const adventureId = event.features[0].properties.id

				navigate(`adventure/${adventureType}/${adventureId}`)
			}
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
				interactiveLayerIds={['adventure-icons', 'sky', 'approach-paths']}
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
				{isPathEditOn && (
					<DrawControl
						position={'bottom-right'}
						onCreate={updateRoute}
						onUpdate={updateRoute}
					/>
				)}
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
				{globalAdventureType === 'ski' && (
					<Source
						type='geojson'
						data={allAdventures.skiApproach}
					>
						<Layer
							id={'approach-paths'}
							type={'line'}
							layout={{ 'line-join': 'round', 'line-cap': 'round' }}
							paint={{ 'line-color': adventurePathColor('skiApproach'), 'line-width': 5 }}
						/>
					</Source>
				)}
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
					data={allAdventures[globalAdventureType]}
				>
					<Layer
						id={'adventure-icons'}
						type={'symbol'}
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
