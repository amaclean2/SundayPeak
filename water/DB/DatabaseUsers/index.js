const DataLayer = require('..')
const {
  createUserStatement,
  selectUserIdStatement,
  getUserByIdStatement,
  getUserWithEmailStatement,
  followUserStatement,
  deleteUserStatement,
  updateUserStatements,
  checkPasswordResetTokenStatement,
  updateNewPasswordStatement,
  getFriendsStatement,
  findNewFriendStatement,
  findFromFriendsStatement,
  insertSearchableStatement,
  getSearchFields,
  getPasswordHashStatement,
  getIsFriendStatement
} = require('../Statements')
const {
  failedInsertion,
  failedQuery,
  failedUpdate,
  failedDeletion
} = require('../utils')

class UserDataLayer extends DataLayer {
  /**
   *
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.firstName
   * @param {string} params.lastName
   * @param {string} params.password
   * @returns {Promise} the id of the new user
   */
  addUserToDatabase({ email, firstName, lastName, password }) {
    return this.sendQuery(createUserStatement, [
      email,
      firstName,
      lastName,
      password
    ])
      .then(([{ insertId }]) => insertId)
      .catch(failedInsertion)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<number|boolean>} a boolean if the email exists
   */
  checkIfUserExistsByEmail({ email }) {
    return this.sendQuery(selectUserIdStatement, [email])
      .then(([results]) => (!!results.length ? results[0].id : false))
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise} the user object
   */
  getUserByEmail({ email }) {
    return this.sendQuery(getUserWithEmailStatement, [email])
      .then(([results]) => (!results.length ? null : results[0]))
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise} a user
   */
  getUserById({ userId }) {
    return this.sendQuery(getUserByIdStatement, [userId])
      .then(([results]) => (!results.length ? null : results[0]))
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise} a reset token if the email exists or null otherwise
   */
  getPasswordResetToken({ email }) {
    return this.sendQuery(getPasswordHashStatement, [email])
      .then(([results]) => {
        return !results.length ? null : results[0].password
      })
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.token
   * @param {number} params.userId
   * @returns {Promise<number|null>} an id if that token exists or null otherwise
   */
  checkPasswordResetToken({ userId, token }) {
    return this.sendQuery(checkPasswordResetTokenStatement, [
      userId,
      `%${token}`
    ])
      .then((result) => {
        return result ? result[0][0] : false
      })
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.newHashedPassword
   * @param {number} params.userId
   * @return {Promise} void
   */
  replaceUserPassword({ newHashedPassword, userId, resetToken }) {
    return this.sendQuery(updateNewPasswordStatement, [
      `%${resetToken}`,
      newHashedPassword,
      userId
    ]).catch(failedUpdate)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.followerId
   * @param {number} params.leaderId
   * @returns {Promise} the new following relationship id
   */
  createUserFollowing({ followerId, leaderId }) {
    return this.sendQuery(getIsFriendStatement, [
      followerId,
      leaderId,
      leaderId,
      followerId
    ])
      .then(([results]) => {
        if (results.length) {
          throw 'user already friended'
        } else {
          return true
        }
      })
      .then(() =>
        this.sendQuery(followUserStatement, [followerId, leaderId, true])
      )
      .then(([results]) => results.insertId)
      .catch(failedInsertion)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.keyword
   * @param {number} params.userId
   * @returns {Promise} void
   */
  updateSearchUserKeywords({ keyword, userId }) {
    return this.sendQuery(insertSearchableStatement, [keyword, userId]).catch(
      failedInsertion
    )
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.keyword
   * @returns {Promise} a list of any users that match the provided string
   */
  searchDatabaseForUserString({ keyword }) {
    return this.sendQuery(findNewFriendStatement, [`%${keyword}%`])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.keyword
   * @param {number} params.userId
   * @returns {Promise} a list of any friends of the user that match the provided string
   */
  searchFriendString({ keywords, userId }) {
    return this.sendQuery(findFromFriendsStatement, [
      userId,
      userId,
      `%${keywords}%`
    ])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise<FriendObject[]>} the list of friends of the given user
   */
  getFriendsData({ userId }) {
    return this.sendQuery(getFriendsStatement, [userId, userId])
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
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.fieldName
   * @param {string} params.fieldValue
   * @param {number} params.userId
   * @returns {Promise} the modified user
   */
  updateDatabaseUser({ fieldName, fieldValue, userId }) {
    return this.sendQuery(updateUserStatements[fieldName], [fieldValue, userId])
      .then(() => this.sendQuery(getSearchFields, [userId]))
      .then(([[result]]) => result)
      .catch(failedUpdate)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @return {Promise} void
   */
  databaseDeleteUser({ userId }) {
    return this.sendQuery(deleteUserStatement, [userId]).catch(failedDeletion)
  }
}

module.exports = UserDataLayer
