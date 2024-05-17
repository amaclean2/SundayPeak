import { useControl } from 'react-map-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

const DrawControl = (props) => {
  useControl(
    () =>
      new MapboxDraw({
        ...props,
        controls: {
          line_string: true,
          trash: true
        },
        displayControlsDefault: false,
        defaultMode: 'draw_line_string',
        modes: {},
        styles: [
          // Set the line style for the user-input coordinates.
          {
            id: 'gl-draw-line',
            type: 'line',
            filter: ['all', ['==', '$type', 'LineString']],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#438EE4',
              'line-width': 4,
              'line-opacity': 0.7
            }
          },
          {
            id: 'gl-draw-vertex-ring',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 12,
              'circle-color': '#FFF'
            }
          },
          {
            id: 'gl-draw-vertex-fill',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 8,
              'circle-color': '#438EE4'
            }
          },
          {
            id: 'gl-draw-vertex-selected',
            type: 'circle',
            filter: [
              'all',
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'Point'],
              ['!=', 'mode', 'static']
            ],
            paint: {
              'circle-radius': 8,
              'circle-color': '#F00'
            }
          },
          {
            id: 'gl-draw-point-midpoint',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'midpoint']
            ],
            paint: {
              'circle-radius': 6,
              'circle-color': '#438EE4'
            }
          }
        ]
      }),
    ({ map }) => {
      map.on('draw.create', props.onCreate)
      map.on('draw.update', props.onUpdate)
      map.on('draw.delete', props.onDelete)
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate)
      map.off('draw.update', props.onUpdate)
      map.off('draw.delete', props.onDelete)
    },
    {
      position: props.position
    }
  )

  return null
}

export default DrawControl
