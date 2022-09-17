import { useCallback, useMemo, useRef, useState } from 'react'
import Map, { GeolocateControl, Layer, Marker, NavigationControl, Source } from 'react-map-gl'

import { SkierIcon } from '../../Images'
import {
	CARD_STATES,
	useAdventureEditContext,
	useCardStateContext,
	useGetAdventures
} from '../../Providers'
import MapPopup from './MapPopup'

import '../../App.css'

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
	const getlocateControlRef = useCallback((ref) => {
		if (ref) ref.trigger()
	}, [])

	const { openCard } = useCardStateContext()
	const {
		adventureAddState,
		setAdventureAddState,
		setCurrentAdventure,
		allAdventures,
		setAllAdventures,
		setIsEditable,
		mapboxToken,
		viewState,
		setViewState
	} = useAdventureEditContext()
	const { refetchAdventures, getAllAdventures } = useGetAdventures()

	const [popupInfo, setPopupInfo] = useState(null)

	const onDblClick = (e) => {
		e.preventDefault()

		if (!adventureAddState) {
			return
		}

		const newAdventure = {
			id: 'waiting',
			adventure_name: 'New Adventure',
			images: [],
			coordinates: {
				lng: e.lngLat.lng,
				lat: e.lngLat.lat
			}
		}

		setAllAdventures((currentAdventures) => {
			return [...currentAdventures, newAdventure]
		})

		setCurrentAdventure(newAdventure)

		openCard(CARD_STATES.adventures)
		setIsEditable(true)
		setAdventureAddState(false)
	}

	const loadMap = (e) => {
		getAllAdventures(mapRef.current.getMap().getBounds())
	}

	const onMove = useCallback((e) => {
		setViewState(e.viewState)
		refetchAdventures(
			{
				lat: e.viewState.latitude,
				lng: e.viewState.longitude,
				zoom: e.viewState.zoom
			},
			mapRef.current.getMap().getBounds()
		)
	}, [])

	/**
	 * zoom 20 is about 200' (* 50)
	 * zoom 15 is about 10,000' (* 50)
	 * zoom 10 is about 300,000' (* 50)
	 * zoom 5 is about 7,000,000' (* 50) (1 / x^2) * 100000
	 */

	const viewMore = () => {
		setCurrentAdventure(popupInfo)
		setPopupInfo(null)
		openCard(CARD_STATES.adventures)
	}

	const pins = useMemo(() => {
		return (
			allAdventures &&
			allAdventures.map((adventure, idx) => (
				<Marker
					key={`marker-${idx}`}
					longitude={adventure.coordinates.lng}
					latitude={adventure.coordinates.lat}
					anchor='bottom'
					onClick={(e) => {
						e.originalEvent.stopPropagation()
						setPopupInfo(adventure)
					}}
				>
					<SkierIcon size={20} />
				</Marker>
			))
		)
	}, [allAdventures])

	if (!allAdventures) {
		return null
	}

	if (!mapboxToken) {
		return null
	}

	return (
		<Map
			ref={mapRef}
			reuseMaps
			className='map-container'
			mapboxAccessToken={mapboxToken}
			mapStyle='mapbox://styles/mapbox/satellite-v9'
			{...viewState}
			maxPitch={85}
			onDblClick={onDblClick}
			onLoad={loadMap}
			onMove={onMove}
			terrain={{ source: 'mapbox-dem', exaggeration: 1 }}
		>
			<NavigationControl showCompass />
			<GeolocateControl ref={getlocateControlRef} />
			<Source
				id='mapbox-dem'
				type='raster-dem'
				url='mapbox://mapbox.mapbox-terrain-dem-v1'
				tileSize={512}
				maxZoom={14}
			/>
			<Layer {...skyLayer} />
			{pins}

			{popupInfo && (
				<MapPopup
					popupInfo={popupInfo}
					viewMore={viewMore}
					setPopupInfo={setPopupInfo}
				/>
			)}
		</Map>
	)
}

export default ReactMap
