import { useCallback, useEffect, useRef } from 'react'
import Map, { GeolocateControl, Layer, NavigationControl, Source } from 'react-map-gl'

import { useAdventureStateContext, useGetAdventures } from '../../Providers'

import '../../App.css'
import AdventurePins from './AdventurePins'
import { useCreateNewAdventure } from './utils'

const skyLayer = {
	id: 'sky',
	type: 'sky',
	paint: {
		'sky-type': 'atmosphere',
		'sky-atmosphere-sun': [0.0, 0.0],
		'sky-atmosphere-sun-intensity': 15
	}
}

const ReactMap = () => {
	const mapRef = useRef()
	const getLocateControlRef = useCallback((ref) => {
		if (ref) ref.trigger()
	}, [])

	const { allAdventures, mapboxToken, startPosition, flyTo, adventureDispatch, mapStyle } =
		useAdventureStateContext()
	const { refetchAdventures, getAllAdventures } = useGetAdventures()
	const { handleCreateNewAdventure } = useCreateNewAdventure()

	const onLoad = () => {
		mapRef?.current?.getMap() && getAllAdventures(mapRef.current.getMap().getBounds())
	}

	// refetchAdventures has to be wrapped in a callback so the debouncer can work
	const onMove = useCallback((event) => {
		refetchAdventures({
			newStartPosition: {
				latitude: event.viewState.latitude,
				longitude: event.viewState.longitude,
				zoom: event.viewState.zoom
			},
			boundingBox: mapRef.current.getMap().getBounds()
		})
	}, [])

	useEffect(() => {
		// flying is set by an external component
		// if flying is set, fly to that location, then unset flying
		if (flyTo) {
			mapRef?.current?.flyTo({
				center: [flyTo.longitude, flyTo.latitude],
				zoom: flyTo.zoom,
				pitch: flyTo.pitch,
				bearing: flyTo.bearing
			})
			adventureDispatch({ type: 'stopFlying' })
		}
	}, [flyTo, adventureDispatch])

	if (!(allAdventures && mapboxToken && mapStyle)) {
		return null
	}

	// extracted the props for the <Map /> component to here so it doesn't clutter the jsx
	const mapProps = {
		ref: mapRef,
		reuseMaps: true,
		className: 'map-container',
		mapboxAccessToken: mapboxToken,
		mapStyle: `${mapStyle}?optimize=true`,
		initialViewState: startPosition,
		maxPitch: 0,
		minZoom: 3,
		onDblClick: handleCreateNewAdventure,
		onLoad,
		onMove
	}

	return (
		<Map {...mapProps}>
			<NavigationControl showCompass />
			<GeolocateControl ref={getLocateControlRef} />
			<Source
				id='mapbox-dem'
				type='raster-dem'
				url='mapbox://mapbox.mapbox-terrain-dem-v1'
				tileSize={512}
				maxZoom={14}
			/>
			<Layer {...skyLayer} />
			<AdventurePins boundingBox={mapRef?.current?.getMap()?.getBounds()} />
		</Map>
	)
}

export default ReactMap
