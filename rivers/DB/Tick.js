const db = require('../Config/db.js')
const logger = require('../Config/logger.js')
const {
	selectTicksByAdventureStatement,
	createTickStatement,
	selectTicksByUserStatement
} = require('./Statements.js')

const getTicksByAdventure = async ({ adventure_id }) => {
	try {
		const [results] = await db.execute(selectTicksByAdventureStatement, [adventure_id])
		return results
	} catch (error) {
		logger.error('DATABASE_RETRIEVAL_FAILED', error)
		throw error
	}
}

const getTicksByUser = async ({ user_id }) => {
	try {
		const [results] = await db.execute(selectTicksByUserStatement, [user_id])
		return results
	} catch (error) {
		logger.error('DATABASE_RETRIEVAL_FAILED', error)
		throw error
	}
}

const createTick = async ({ adventure_id, user_id: creator_id, public: publicField }) => {
	try {
		const [results] = await db.execute(createTickStatement, [creator_id, adventure_id, publicField])
		return results.insertId
	} catch (error) {
		logger.error('DATABASE_INSERTION_FAILED', error)
		throw error
	}
}

module.exports = {
	getTicksByAdventure,
	getTicksByUser,
	createTick
}