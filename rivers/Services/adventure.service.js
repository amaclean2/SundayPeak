const queries = require('../DB')

const buildAdventureObject = async ({ id }) => {
	const {
		getAdventure,
		getTicksByAdventure,
		getAdventurePictures
	} = queries

	const adventure = await getAdventure(id)
	const ticks = await getTicksByAdventure({ adventure_id: id })
	const images = await getAdventurePictures({ adventure_id: id })

	return {
		...adventure,
		images,
		ticks: ticks.map((tick) => ({
			...tick,
			user_id: tick.creator_id
		}))
	}
}

const parseCoordinates = ({ boundingBox }) => {
	return {
		maxLat: boundingBox.NE.lat,
		minLat: boundingBox.SW.lat,
		maxLng: boundingBox.NE.lng,
		minLng: boundingBox.SW.lng
	}
}

module.exports = {
	buildAdventureObject,
	parseCoordinates
}