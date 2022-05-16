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

      // adding a point
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.current.setTerrain({ 'source': 'mapbox-dem' });
      // map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // add a sky layer that will show when the map is highly pitched
      map.current.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
      // end adding a point

    });

    return () => map.current.remove()
  }, []);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
