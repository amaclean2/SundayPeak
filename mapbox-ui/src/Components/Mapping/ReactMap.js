import React, { useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';

import { mapboxAccessToken } from '../../Constants';

import { SkierIcon } from '../../Images';
import { CARD_STATES, useAdventureEditContext, useCardStateContext } from '../../Providers';
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
		defaultStartPosition
	} = useAdventureEditContext();

	const initialViewState = {
		longitude: defaultStartPosition.lng,
		latitude: defaultStartPosition.lat,
		zoom: defaultStartPosition.zoom
	};

	const onDblClick = (e) => {
		e.preventDefault();

		if (!adventureAddState) {
			return;
		}

		setAllAdventures((currAdventureData) => {
			console.log({ lat: e.lngLat.lat, lng: e.lngLat.lng });
			const newAdventureData = [...currAdventureData];
			newAdventureData.push({
				name: "abc",
				id: allAdventures.length,
				geometry: {
					coordinates: [e.lngLat.lng, e.lngLat.lat]
				},
				properties: {}
			});

			return newAdventureData;
		});

		setAdventureAddState(false);
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

	return <Map
		reuseMaps
		className="map-container"
		mapboxAccessToken={mapboxAccessToken}
		mapStyle="mapbox://styles/mapbox/satellite-v9"
		initialViewState={initialViewState}
		maxPitch={85}
		onClick={onDblClick}
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