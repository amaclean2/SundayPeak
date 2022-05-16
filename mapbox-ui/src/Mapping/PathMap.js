import { useEffect, useRef, useState } from 'react';
import mapboxGl from 'mapbox-gl';

import { mapboxAccessToken } from '../Constants';
import { climbs } from '../Stores';

import '../App.css';

const Map = () => {

  mapboxGl.accessToken = mapboxAccessToken;
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [long, setLong] = useState(-120.2);
  const [lat, setLat] = useState(39.3);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    map.current = new mapboxGl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [long, lat],
      zoom
    });

    map.current.on('move', () => {
      setLong(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    climbs.features.forEach((climb, idx) => {
      climb.properties.id = idx;
    });

    map.current.on('load', () => {
      map.current.addLayer({
        id: 'locations',
        type: 'circle',
        source: {
          type: 'geojson',
          data: climbs
        }
      });

      // adding a path
      map.current.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [-122.483696, 37.833818],
              [-122.483482, 37.833174],
              [-122.483396, 37.8327],
              [-122.483568, 37.832056],
              [-122.48404, 37.831141],
              [-122.48404, 37.830497],
              [-122.483482, 37.82992],
              [-122.483568, 37.829548],
              [-122.48507, 37.829446],
              [-122.4861, 37.828802],
              [-122.486958, 37.82931],
              [-122.487001, 37.830802],
              [-122.487516, 37.831683],
              [-122.488031, 37.832158],
              [-122.488889, 37.832971],
              [-122.489876, 37.832632],
              [-122.490434, 37.832937],
              [-122.49125, 37.832429],
              [-122.491636, 37.832564],
              [-122.492237, 37.833378],
              [-122.493782, 37.833683]
            ]
          }
        }
      });

      map.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#F00',
          'line-width': 8
        }
      });
      // end adding a path
    });

    return () => map.current.remove()
  }, []);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
