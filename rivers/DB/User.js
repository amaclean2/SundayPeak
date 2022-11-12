const db = require('../Config/db.js')
const logger = require('../Config/logger.js')
const cryptoHandlers = require('../Crypto/index.js')
const { mapboxStyles } = require('../Services/utils.js')
const {
  createUserStatement,
  selectUserIdStatement,
  getUserByIdStatement,
  getUserWithEmailStatement,
  followUserStatement,
  deleteUserStatement,
  deleteTickByUserStatement,
  deleteActivityByUserStatement,
  updateUserStatements,
  checkPasswordResetTokenStatement,
  updateNewPasswordStatement,
  getFriendCredStatement,
  getFriendsStatement,
  getFriendsCountStatement,
  getIsFriendStatement
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

const checkForUser = async ({ email }) => {
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

const checkPasswordResetToken = async ({ token }) => {
  return db
    .execute(checkPasswordResetTokenStatement, [token])
    .then((result) => {
      return result[0][0]
    })
    .catch((error) => {
      throw {
        message: 'Database insertion failed',
        error
      }
    })
}

const updatePassword = async ({ newPassword, userId }) => {
  const password = cryptoHandlers.hashPassword(newPassword)
  return db
    .execute(updateNewPasswordStatement, [password, userId])
    .then((result) => result)
    .catch((error) => {
      throw { message: 'Database update failed', error }
    })
}

const followUser = async ({ followerId, leaderId }) => {
  try {
    const [results] = await db.execute(followUserStatement, [
      followerId,
      leaderId,
      false
    ])
    return results.insertId
  } catch (error) {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  }
}

const getFriendCreds = async ({ followedId }) => {
  try {
    const [results] = await db.execute(getFriendCredStatement, [followedId])
    return results[0]
  } catch (error) {
    logger.error('DATABASE_RETRIEVAL_FAILED', error)
    throw error
  }
}

const getRelationship = async ({ follower_id, leader_id }) => {
  try {
    const [results] = await db.execute(getIsFriendStatement, [
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
    const [results] = await db.execute(getFriendsCountStatement, [
      user_id,
      user_id
    ])
    return results[0]['COUNT(follower_id)']
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getFriendsLookup = async ({ userId }) => {
  try {
    const [results] = await db.execute(getFriendsStatement, [userId, userId])
    return results.map((result) =>
      result.leader_id === Number(userId)
        ? {
            id: result.follower_id,
            first_name: result.follower_first_name,
            last_name: result.follower_last_name,
            email: result.follower_email
          }
        : {
            id: result.leader_id,
            first_name: result.leader_first_name,
            last_name: result.leader_last_name,
            email: result.leader_email
          }
    )
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
  checkPasswordResetToken,
  updatePassword,
  followUser,
  getFriendCreds,
  getRelationship,
  getFriendCount,
  getFriendsLookup,
  updateUser,
  deleteUser
}
