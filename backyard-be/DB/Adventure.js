const db = require('../Config/db.js')
const logger = require('../Config/logger.js')
const {
	createNewAdventureStatement,
	deleteActivityByAdventureStatement,
	deleteAdventureStatement,
	deleteTickByAdventureStatement,
	selectAdventureByIdStatement,
	selectAdventuresInRangeStatement
} = require('./Statements.js')

const addAdventure = async (adventure) => {
	try {
		const {
			adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
			difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat,
			coordinates_lng
		} = adventure

		const [results] = await db.execute(createNewAdventureStatement, [
			adventure_type,
			adventure_name,
			approach_distance || 0,
			season || '',
			avg_angle || 0,
			max_angle || 0,
			difficulty || 0,
			elevation || 0,
			gear || '',
			gain || 0,
			bio || '',
			nearest_city || '',
			creator_id,
			coordinates_lat,
			coordinates_lng
		])
        
		return results.insertId
	} catch (error) {
		logger.error('DATABASE_INSERTION_FAILED', error)
		throw error
	}
}

const getAdventure = async (id) => {
	try {
		const [results] = await db.execute(selectAdventureByIdStatement, [id])
		return results[0]
	} catch (error) {
		logger.error('DATABASE_QUERY_FAILED', error)
		throw error
	}
}

const getAdventures = async (coordinates, type) => {
	try {
		const [results] = await db.execute(selectAdventuresInRangeStatement, [
			coordinates.maxLat,
			coordinates.minLat,
			coordinates.minLng,
			coordinates.maxLng,
			type
		])

		return results.map((result) => {
			const newResult = {
				...result,
				coordinates: {
					lat: result.coordinates_lat,
					lng: result.coordinates_lng
				}
			}
			delete newResult.coordinates_lat
			delete newResult.coordinates_lng

			return newResult
		})
	} catch (error) {
		logger.error('DATABASE_QUERYL_FAILED', error)
		throw error
	}
}

const deleteAdventure = async (adventureId) => {
	return db.execite(deleteTickByAdventureStatement, [adventureId])
		.then(() => db.execute(deleteActivityByAdventureStatement, [adventureId]))
		.then(() => db.execute(deleteAdventureStatement, [adventureId]))
		.then(([result]) => result)
		.catch((error) => {
			logger.error('DATABASE_DELETION_FAILED', error)
			throw error
		})
}

module.exports = {
	addAdventure,
	getAdventure,
	getAdventures,
	deleteAdventure
}