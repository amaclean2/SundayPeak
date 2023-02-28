const { sendQuery } = require('../Config/db')
const logger = require('../Config/logger')
const cryptoHandlers = require('../Crypto/index')
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
  getIsFriendStatement,
  findNewFriendStatement,
  findFromFriendsStatement,
  insertSearchableStatement,
  getSearchFields
} = require('./Statements')

const addUserToDatabase = async ({
  email,
  first_name,
  last_name,
  password
}) => {
  try {
    const [result] = await sendQuery(createUserStatement, [
      email,
      first_name,
      last_name,
      password
    ])
    return result.insertId
  } catch (error) {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  }
}

const checkForUser = async ({ email }) => {
  try {
    const [results] = await sendQuery(selectUserIdStatement, [email])
    return !!results.length
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getUser = async (email) => {
  try {
    const [results] = await sendQuery(getUserWithEmailStatement, [email])
    return !results.length ? null : results[0]
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getUserById = async (id) => {
  try {
    const [results] = await sendQuery(getUserByIdStatement, [id])
    return !results.length ? null : results[0]
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const checkPasswordResetToken = async ({ token }) =>
  sendQuery(checkPasswordResetTokenStatement, [token])
    .then((result) => {
      return result[0][0]
    })
    .catch((error) => {
      throw {
        message: 'Database insertion failed',
        error
      }
    })

const updatePassword = async ({ newPassword, userId }) => {
  const password = cryptoHandlers.hashPassword(newPassword)
  return sendQuery(updateNewPasswordStatement, [password, userId])
    .then((result) => result)
    .catch((error) => {
      throw { message: 'Database update failed', error }
    })
}

const followUser = async ({ followerId, leaderId }) => {
  try {
    const [results] = await sendQuery(followUserStatement, [
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
    const [results] = await sendQuery(getFriendCredStatement, [followedId])
    return results[0]
  } catch (error) {
    logger.error('DATABASE_RETRIEVAL_FAILED', error)
    throw error
  }
}

/**
 *
 * @param {Object} params | the parameter object
 * @param {string} params.keyword | the search keywords to enter into the database
 * @param {int} params.userId | the userId associated with the search string
 * @returns a promise to insert the keywords into the database
 */
const updateSearchUserKeywords = ({ keyword, userId }) =>
  sendQuery(insertSearchableStatement, [keyword, userId])

const searchDatabaseForUserString = async ({ keyword }) =>
  sendQuery(findNewFriendStatement, [`%${keyword}%`])
    .then(([results]) => results)
    .catch((error) => {
      logger.error('DATABASE_QUERY_FAILED', error)
      throw error
    })

const searchFriends = async ({ keywords, userId }) => {
  try {
    const [results] = await sendQuery(findFromFriendsStatement, [
      userId,
      userId,
      `%${keywords}%`
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getRelationship = async ({ follower_id, leader_id }) => {
  try {
    const [results] = await sendQuery(getIsFriendStatement, [
      follower_id,
      leader_id
    ])
    return results
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getFriendCount = async ({ userId }) => {
  try {
    const [results] = await sendQuery(getFriendsCountStatement, [
      userId,
      userId
    ])
    return results[0]['COUNT(follower_id)']
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

/**
 *
 * @param {Object} params | Destructures function params
 * @param {int} params.userId | the id of the user to be modified
 * @returns a promise returning the list of friends of the given user
 */
const getFriendsData = ({ userId }) =>
  sendQuery(getFriendsStatement, [userId, userId])
    .then(([results]) =>
      results.map((result) =>
        result.leader_id === Number(userId)
          ? {
              id: result.follower_id,
              display_name: result.follower_display_name,
              email: result.follower_email
            }
          : {
              id: result.leader_id,
              display_name: result.leader_display_name,
              email: result.leader_email
            }
      )
    )
    .catch((error) => {
      logger.error('DATABASE_QUERY_FAILED', error)
      throw error
    })

/**
 *
 * @param {Object} params Destructures function params
 * @param {string} params.fieldName | the name of the property to be modifies
 * @param {string} params.fieldValue | the value to be modified
 * @param {int} params.userId | the id of the user to be modified
 * @returns a promise returning the modified user
 */
const updateDatabaseUser = async ({ fieldName, fieldValue, userId }) => {
  return sendQuery(updateUserStatements[fieldName], [fieldValue, userId])
    .then(() => sendQuery(getSearchFields, [userId]))
    .then(([[result]]) => result)
    .catch((error) => {
      logger.error('DATABASE_UPDATE_FAILED', error)
      throw error
    })
}

const deleteUser = async (userId) => {
  return sendQuery(deleteTickByUserStatement, [userId])
    .then(() => sendQuery(deleteActivityByUserStatement, [userId]))
    .then(() => sendQuery(deleteUserStatement, [userId]))
    .then(([result]) => result)
    .catch((error) => {
      logger.error('DATABASE_DELETION_FAILED', error)
      throw error
    })
}

module.exports = {
  addUserToDatabase,
  checkForUser,
  getUser,
  getUserById,
  searchDatabaseForUserString,
  searchFriends,
  checkPasswordResetToken,
  updatePassword,
  followUser,
  getFriendCreds,
  getRelationship,
  getFriendCount,
  getFriendsData,
  updateDatabaseUser,
  deleteUser,
  updateSearchUserKeywords
}
