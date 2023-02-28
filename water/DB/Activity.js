const { db, sendQuery } = require('../Config/db')
const logger = require('../Config/logger')
const {
  selectActivitiesByAdventureStatement,
  getCompletedAdventureByUserStatement,
  createActivityStatement,
  getCompletedAdventureCountByUserStatement
} = require('./Statements')

const getActivitiesByAdventure = async ({ adventure_id }) =>
  sendQuery(selectActivitiesByAdventureStatement, [adventure_id])
    .then(([results]) => results)
    .catch((error) => {
      logger.error('DATABASE_QUERY_FAILED', error)
      throw error
    })

const getCompletedAdventuresByUser = async ({ userId }) =>
  sendQuery(getCompletedAdventureByUserStatement, [userId])
    .then(([results]) => results)
    .catch((error) => {
      logger.error('DATABASE_QUERY_FAILED', error)
      throw error
    })

const getCompletedAdventureCountByUser = async ({ userId }) => {
  try {
    const [results] = await sendQuery(
      getCompletedAdventureCountByUserStatement,
      [userId]
    )
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
    const [results] = await sendQuery(createActivityStatement, [
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
  getCompletedAdventuresByUser,
  getCompletedAdventureCountByUser,
  createActivity
}
