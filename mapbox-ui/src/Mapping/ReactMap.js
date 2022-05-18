import { useCallback, useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';

import { mapboxAccessToken } from '../Constants';

import '../App.css';
import SkierIcon from '../Images/SkierIcon';
import { useLineEditContext } from '../Providers/lineEditProvider';
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
	const { lineAddState, setLineAddState, setCurrentLine, allLines, setAllLines } = useLineEditContext();

	const onDblClick = (e) => {
		e.preventDefault();

		if (!lineAddState) {
			return;
		}

		setAllLines((currLineData) => {
			const newLineData = [...currLineData];
			newLineData.push({
				name: "abc",
				id: allLines.length,
				geometry: {
					coordinates: [e.lngLat.lng, e.lngLat.lat]
				},
				properties: {}
			});

			return newLineData;
		});

		setLineAddState(false);
	};

	const viewMore = () => {
		setCurrentLine(popupInfo);
		setPopupInfo(null);
		openCard('lines');
	}

	const pins = useMemo(() => {
		return allLines.map((line, idx) => (
			<Marker
				key={`marker-${idx}`}
				longitude={line.geometry.coordinates[0]}
				latitude={line.geometry.coordinates[1]}
				anchor="bottom"
				onClick={(e) => {
					e.originalEvent.stopPropagation();
					setPopupInfo(line);
				}}
			>
				<SkierIcon size={20} />
			</Marker>
		))
	}, [allLines]);

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
