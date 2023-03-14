import { StyleSheet, Text, View } from 'react-native'

const AdventureView = () => {
	return (
		<View style={styles.adventureContainer}>
			<Text>This is an adventure</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	adventureContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1
	}
})

export default AdventureView
