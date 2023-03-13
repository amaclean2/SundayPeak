import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Map, {
	FullscreenControl,
	GeolocateControl,
	Layer,
	NavigationControl,
	Source
} from 'react-map-gl'

import { useCreateNewAdventure } from './utils'
import { useTokenStateContext } from 'Hooks/Providers/tokenStateProvider'
import { useAdventureStateContext } from 'Hooks/Providers'

import skier from 'Images/Activities/SkierIcon.png'
import hiker from 'Images/Activities/HikerIcon.png'
import climber from 'Images/Activities/ClimberIcon.png'

import './styles.css'

const ReactMap = () => {
	const mapRef = useRef()

	const getLocateControlRef = useCallback((ref) => {
		if (ref) ref.trigger()
	}, [])

	const { allAdventures, startPosition, currentAdventure, adventureTypeViewer } =
		useAdventureStateContext()
	const { mapboxToken, mapboxStyleKey } = useTokenStateContext()
	const { handleCreateNewAdventure } = useCreateNewAdventure()
	const navigate = useNavigate()

	const onLoad = () => {
		const map = mapRef.current?.getMap()
		const icons = [
			[skier, 'ski'],
			[hiker, 'hike'],
			[climber, 'climb']
		]

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

	// refetchAdventures has to be wrapped in a callback so the debouncer can work
	const onMove = () => {
		// set the new start position
	}

	useEffect(() => {
		if (!currentAdventure || !mapRef.current) {
			return
		}

		mapRef.current.flyTo({
			center: [currentAdventure.coordinates.lng, currentAdventure.coordinates.lat],
			zoom: 16
		})
	}, [currentAdventure?.id, mapRef.current])

	if (!(allAdventures && mapboxToken && mapboxStyleKey)) {
		return null
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
		onDblClick: (event) => {
			handleCreateNewAdventure(event)
		},
		onClick: (event) => {
			if (!event.features.length) return

			navigate(
				`adventure/${event.features[0].properties.adventure_type}/${event.features[0].properties.id}`
			)
		},
		onLoad,
		onMove
	}

	return (
		<div
			className={'map-container'}
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
					data={allAdventures}
				>
					<Layer
						id={'adventure-icons'}
						type={'symbol'}
						source={'adventures'}
						layout={{
							'icon-image': adventureTypeViewer,
							'icon-size': 0.4
						}}
					/>
				</Source>
			</Map>
		</div>
	)
}

export default ReactMap
