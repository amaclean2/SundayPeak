import React, { useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';

import { mapboxAccessToken } from '../Constants';

import '../App.css';
import SkierIcon from '../Images/SkierIcon';
import { useAdventureEditContext } from '../Providers/adventureEditProvider';
import { useCardStateContext } from '../Providers/cardStateProvider';
import MapPopup from './MapPopup';

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
	const initialViewportState = {
		longitude: -120.2,
		latitude: 39.3,
		zoom: 10
	};
	const [popupInfo, setPopupInfo] = useState(null);

	const { openCard } = useCardStateContext();
	const { adventureAddState, setAdventureAddState, setCurrentAdventure, allAdventures, setAllAdventures } = useAdventureEditContext();

	const onDblClick = (e) => {
		e.preventDefault();

		if (!adventureAddState) {
			return;
		}

		setAllAdventures((currAdventureData) => {
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
		openCard('adventures');
	}

	const pins = useMemo(() => {
		return allAdventures.map((adventure, idx) => (
			<Marker
				key={`marker-${idx}`}
				longitude={adventure.geometry.coordinates[0]}
				latitude={adventure.geometry.coordinates[1]}
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

	return <Map
		reuseMaps
		className="map-container"
		mapboxAccessToken={mapboxAccessToken}
		mapStyle="mapbox://styles/mapbox/satellite-v9"
		initialViewState={initialViewportState}
		maxPitch={85}
		onDblClick={onDblClick}
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
