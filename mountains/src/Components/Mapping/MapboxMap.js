import React, { useRef } from 'react'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { useTokenStateContext } from '@amaclean2/sundaypeak-treewells'
import { useMapboxHooks } from './MapboxHooks'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './styles.css'

const MapboxMap = () => {
	const mapContainerRef = useRef(null)
	const mapRef = useRef()

	const { mapboxToken } = useTokenStateContext()
	mapboxgl.accessToken = mapboxToken

	useMapboxHooks(mapRef, mapContainerRef)

	return (
		<div
			className={'map-container'}
			ref={mapContainerRef}
		/>
	)
}

export default MapboxMap
