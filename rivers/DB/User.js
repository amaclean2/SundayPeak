const db = require('../Config/db.js')
const logger = require('../Config/logger.js')
const { mapboxStyles } = require('../Services/utils.js')
const {
  createUserStatement,
  selectUserIdStatement,
  getUserByIdStatement,
  getUserWithEmailStatement,
  savePasswordResetTokenStatement,
  getPasswordResetEmailStatement,
  getFollowersCountStatement,
  followUserStatement,
  getFollowersStatement,
  deleteUserStatement,
  deleteTickByUserStatement,
  deleteActivityByUserStatement,
  getIsFollowedStatement,
  updateUserStatements
} = require('./Statements.js')

const addUser = async ({ email, password, first_name, last_name }) => {
  try {
    const [result] = await db.execute(createUserStatement, [
      email,
      password,
      first_name,
      last_name,
      mapboxStyles.default
    ])
    return result.insertId
  } catch (error) {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  }
}

const checkForUser = async (email) => {
  try {
    const [results] = await db.execute(selectUserIdStatement, [email])
    return !!results.length
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getUser = async (email) => {
  try {
    const [results] = await db.execute(getUserWithEmailStatement, [email])
    return !results.length ? null : results[0]
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getUserById = async (id) => {
  try {
    const [results] = await db.execute(getUserByIdStatement, [id])
    return !results.length ? null : results[0]
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const savePasswordResetToken = async ({ email, token }) => {
  return db
    .execute(savePasswordResetTokenStatement, [email, token])
    .then((result) => result[0].insertId)
    .catch((error) => {
      throw {
        message: 'Database insertion failed',
        error
      }
    })
}

const getPasswordResetEmail = async ({ token }) => {
  return db
    .execute(getPasswordResetEmailStatement, [token])
    .then(([results]) => {
      if (!results.length) {
        return null
      }

      return results[0]
    })
    .catch((error) => {
      throw {
        message: 'Database query failed',
        error
      }
    })
}

const followUser = async ({ follower_id, leader_id }) => {
  try {
    const [results] = await db.execute(followUserStatement, [
      follower_id,
      leader_id,
      false
    ])
    return results.insertId
  } catch (error) {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  }
}

const getRelationship = async ({ follower_id, leader_id }) => {
  try {
    const [results] = await db.execute(getIsFollowedStatement, [
      follower_id,
      leader_id
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getFriendCount = async ({ user_id }) => {
  try {
    const [results] = await db.execute(getFollowersCountStatement, [user_id])
    return results[0]['COUNT(follower_id)']
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getFriendsLookup = async ({ userId }) => {
  try {
    const [results] = await db.execute(getFollowersStatement, [userId])
    return results
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const updateUser = async ({ fields }) => {
  const responses = await Promise.all([
    fields.map((field) => {
      return db
        .execute(updateUserStatements[field.field_name], [
          field.field_value,
          field.user_id
        ])
        .then(([result]) => result)
        .catch((error) => {
          logger.error('DATABASE_UPDATE_FAILED', error)
          throw error
        })
    })
  ])

  return responses
}

const deleteUser = async (userId) => {
  return db
    .execute(deleteTickByUserStatement, [userId])
    .then(() => db.execute(deleteActivityByUserStatement, [userId]))
    .then(() => db.execute(deleteUserStatement, [userId]))
    .then(([result]) => result)
    .catch((error) => {
      logger.error('DATABASE_DELETION_FAILED', error)
      throw error
    })
}

module.exports = {
  addUser,
  checkForUser,
  getUser,
  getUserById,
  savePasswordResetToken,
  getPasswordResetEmail,
  followUser,
  getRelationship,
  getFriendCount,
  getFriendsLookup,
  updateUser,
  deleteUser
}