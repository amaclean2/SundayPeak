import React, { useMemo, useState } from 'react';
import { throttle } from 'throttle-debounce';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';

import { SkierIcon } from '../../Images';
import { CARD_STATES, useAdventureEditContext, useCardStateContext, useGetAdventures } from '../../Providers';
import MapPopup from './MapPopup';

import '../../App.css';

const skyLayer = {
	id: 'sky',
	type: 'sky',
	paint: {
		'sky-type': 'atmosphere',
		'sky-atmosphere-sun': [0.0, 0.0],
		'sky-atmosphere-sun-intensity': 15
	}
};

const ReactMap = () => {
	const [popupInfo, setPopupInfo] = useState(null);

	const { openCard } = useCardStateContext();
	const {
		adventureAddState,
		setAdventureAddState,
		setCurrentAdventure,
		allAdventures,
		setAllAdventures,
		setIsEditable,
		mapboxToken,
		startPosition
	} = useAdventureEditContext();
	const { refetchAdventures } = useGetAdventures();

	console.log("SP", startPosition)

	const initialViewState = {
		longitude: startPosition.lng,
		latitude: startPosition.lat,
		zoom: startPosition.zoom
	};

	const onDblClick = (e) => {
		e.preventDefault();

		if (!adventureAddState) {
			return;
		}

		const newAdventure = {
			adventure_name: 'New Adventure',
			coordinates: {
				lng: e.lngLat.lng,
				lat: e.lngLat.lat
			}
		};

		setAllAdventures((currentAdventures) => {
			return [...currentAdventures, newAdventure];
		});

		setCurrentAdventure(newAdventure);

		openCard(CARD_STATES.adventures);
		setIsEditable(true);
		setAdventureAddState(false);
	};

	const onMove = (e) => {
		refetchAdventures({ lat: e.viewState.latitude, lng: e.viewState.longitude, zoom: e.viewState.zoom });
	};

	const viewMore = () => {
		setCurrentAdventure(popupInfo);
		setPopupInfo(null);
		openCard(CARD_STATES.adventures);
	}

	const pins = useMemo(() => {
		return allAdventures && allAdventures.map((adventure, idx) => (
			<Marker
				key={`marker-${idx}`}
				longitude={adventure.coordinates.lng}
				latitude={adventure.coordinates.lat}
				anchor="bottom"
				onClick={(e) => {
					e.originalEvent.stopPropagation();
					setPopupInfo(adventure);
				}}
			>
				<SkierIcon size={20} />
			</Marker>
		))
	}, [allAdventures]);

	if (!allAdventures) {
		return null;
	}

	if (!mapboxToken) {
		return null;
	}

	return <Map
		reuseMaps
		className="map-container"
		mapboxAccessToken={mapboxToken}
		mapStyle="mapbox://styles/mapbox/satellite-v9"
		initialViewState={initialViewState}
		maxPitch={85}
		onDblClick={onDblClick}
		onMove={onMove}
		terrain={{ source: 'mapbox-dem', exaggeration: 1 }}
	>
		<NavigationControl showCompass />

		<Source
			id="mapbox-dem"
			type="raster-dem"
			url="mapbox://mapbox.mapbox-terrain-dem-v1"
			tileSize={512}
			maxZoom={14}
		/>
		<Layer {...skyLayer} />
		{pins}

		{popupInfo && (
			<MapPopup popupInfo={popupInfo} viewMore={viewMore} setPopupInfo={setPopupInfo} />
		)}
	</Map>
};

export default ReactMap;
