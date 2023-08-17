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
				styles: [
					// Set the line style for the user-input coordinates.
					{
						id: 'gl-draw-line',
						type: 'line',
						filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
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
					// Style the vertex point halos.
					{
						id: 'gl-draw-polygon-and-line-vertex-halo-active',
						type: 'circle',
						filter: [
							'all',
							['==', 'meta', 'vertex'],
							['==', '$type', 'Point'],
							['!=', 'mode', 'static']
						],
						paint: {
							'circle-radius': 12,
							'circle-color': '#FFF'
						}
					},
					// Style the vertex points.
					{
						id: 'gl-draw-polygon-and-line-vertex-active',
						type: 'circle',
						filter: [
							'all',
							['==', 'meta', 'vertex'],
							['==', '$type', 'Point'],
							['!=', 'mode', 'static']
						],
						paint: {
							'circle-radius': 8,
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
