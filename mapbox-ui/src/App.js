import { useEffect, useRef, useState } from 'react';

import mapboxGl from 'mapbox-gl';
import { mapboxAccessToken } from './Constants';

import './App.css';

const App = () => {

  mapboxGl.accessToken = mapboxAccessToken;
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [long, setLong] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    map.current = new mapboxGl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [long, lat],
      zoom
    });
  }, []);

  return (
    <div className="App">
      Backyard Friends
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default App;
