const { sendQuery } = require('../Config/db')
const logger = require('../Config/logger')
const {
  selectTicksByAdventureStatement,
  createTickStatement,
  deleteTickStatement,
  selectTodoAdventuresByUserStatement
} = require('./Statements')

const getTicksByAdventure = async ({ adventureId }) => {
  try {
    const [results] = await sendQuery(selectTicksByAdventureStatement, [
      adventureId
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_RETRIEVAL_FAILED', error)
    throw error
  }
}

const getTodoAdventuresByUser = async ({ userId }) => {
  try {
    const [results] = await sendQuery(selectTodoAdventuresByUserStatement, [
      userId
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_RETRIEVAL_FAILED', error)
    throw error
  }
}

const createTick = async ({
  adventure_id,
  user_id: creator_id,
  public: publicField
}) => {
  try {
    const [results] = await sendQuery(createTickStatement, [
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

const deleteTick = async ({ adventureId, userId }) => {
  try {
    const result = await sendQuery(deleteTickStatement, [adventureId, userId])
    logger.debug('DELETED_TICK', result)
    return result
  } catch (error) {
    logger.error('DATABASE_DELETION_FAILED', error)
    throw error
  }
}

module.exports = {
  getTicksByAdventure,
  getTodoAdventuresByUser,
  createTick,
  deleteTick
}
