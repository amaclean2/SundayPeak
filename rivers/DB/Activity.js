const { db } = require('../Config/db')
const logger = require('../Config/logger')
const {
  selectActivitiesByAdventureStatement,
  selectActivitiesByUserStatement,
  createActivityStatement,
  countActivitiesStatement
} = require('./Statements')

const getActivitiesByAdventure = async ({ adventure_id }) => {
  try {
    const [results] = await db.execute(selectActivitiesByAdventureStatement, [
      adventure_id
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getActivitiesByUser = async ({ user_id }) => {
  try {
    const [results] = await db.execute(selectActivitiesByUserStatement, [
      user_id
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getActivityCountByUser = async ({ user_id }) => {
  try {
    const [results] = await db.execute(countActivitiesStatement, [user_id])
    return results[0]['COUNT(adventure_id)']
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const createActivity = async ({
  adventure_id,
  user_id: creator_id,
  public: publicField
}) => {
  try {
    const [results] = await db.execute(createActivityStatement, [
      creator_id,
      adventure_id,
      publicField
    ])
    return results.insertId
  } catch (error) {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  }
}

module.exports = {
  getActivitiesByAdventure,
  getActivitiesByUser,
  getActivityCountByUser,
  createActivity
}
