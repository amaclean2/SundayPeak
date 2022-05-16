import { useCallback, useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl';

import { mapboxAccessToken } from '../Constants';
import { Lines } from '../Lines';

import '../App.css';
import SkierIcon from '../Images/SkierIcon';
import { useLineEditContext } from '../Providers/lineEditProvider';
import { useCardStateContext } from '../Providers/cardStateProvider';

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

	const [lineData, setLineData] = useState(Lines);
	const [popupInfo, setPopupInfo] = useState(null);

	const { openCard } = useCardStateContext();
	const { lineEditState, setLineEditState, setCurrentLine } = useLineEditContext();

	const onDblClick = (e) => {
		e.preventDefault();

		console.log(lineEditState);

		if (!lineEditState) {
			return;
		}

		setLineData((currLineData) => {
			const newLineData = [...currLineData];
			newLineData.push({
				name: "abc",
				geometry: {
					coordinates: [e.lngLat.lng, e.lngLat.lat]
				}
			});

			return newLineData;
		});

		setLineEditState(false);

	};

	const viewMore = () => {
		setCurrentLine(popupInfo.name);
		setPopupInfo(null);
		openCard('lines');
	}

	const pins = useMemo(() => {
		return lineData.map((line, idx) => (
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
	}, [lineData]);

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
			<Popup
				className="line-pop-up"
				anchor="top"
				longitude={Number(popupInfo.geometry.coordinates[0])}
				latitude={Number(popupInfo.geometry.coordinates[1])}
				onClose={() => setPopupInfo(null)}
			>
				Hi, this is some popup info about {popupInfo.name}
				<button
					className="button popup-view-more-button"
					onClick={viewMore}
				>
					View More
				</button>
			</Popup>
		)}
	</Map>
};

export default ReactMap;
