import MapboxGL from '@rnmapbox/maps'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useInitialCall } from './Hooks/Mapbox'
import { useAppStateContext } from './Hooks/Providers/appStateProvider'

const MapView = () => {
	const initialCall = useInitialCall()
	const { mapboxToken, mapboxStyle } = useAppStateContext()

	useEffect(() => {
		if (mapboxToken) {
			MapboxGL.setAccessToken(mapboxToken)
		} else {
			initialCall()
		}
	}, [mapboxToken])

	if (mapboxToken) {
		return (
			<View style={styles.container}>
				<MapboxGL.MapView
					style={styles.container}
					compassEnabled={true}
					styleURL={mapboxStyle}
				></MapboxGL.MapView>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<Text>Loading...</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	mediumWidth: {
		flex: 1
	},
	container: {
		flex: 1
	}
})

export default MapView
