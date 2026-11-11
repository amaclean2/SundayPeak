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
  getPasswordHashStatement,
  getIsFriendStatement,
  createUserPictureStatement,
  getUserPicturesStatement,
  deletePictureStatement,
  optOutOfEmailStatement,
  updateUserStatement
} = require('../Statements')
const { selectDeviceTokenForUserStatement } = require('../Statements/Messages')
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
  addUserToDatabase({
    email,
    firstName,
    lastName,
    password,
    profilePicture = ''
  }) {
    return this.sendQuery(createUserStatement, [
      email,
      firstName,
      lastName,
      password,
      profilePicture
    ])
      .then(([{ insertId }]) => ({
        userId: insertId
      }))
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
      .then(([results]) => (results.length ? results[0] : null))
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
        if (!results.length) {
          return null
        }

        const hashedToken = results[0].password
        const shortToken = hashedToken.substring(hashedToken.length - 10)
        return shortToken
      })
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.token
   * @returns {Promise<number|null>} an id if that token exists or null otherwise
   */
  checkPasswordResetToken({ token }) {
    return this.sendQuery(checkPasswordResetTokenStatement, [`%${token}`])
      .then(([results]) => {
        return results.length ? results[0].id : null
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
  replaceUserPassword({ newHashedPassword, userId }) {
    return this.sendQuery(updateNewPasswordStatement, [
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
   * @param {Object} params
   * @param {string} params.url
   * @param {number} params.userId
   * @returns {Promise<string>}
   */
  saveImageToUser({ url, userId }) {
    return this.sendQuery(createUserPictureStatement, [url, userId])
      .then(() => {
        return 'user image saved'
      })
      .catch(failedInsertion)
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise<string[]>} | a list of urls attributed to that user
   */
  getUserImages({ userId }) {
    return this.sendQuery(getUserPicturesStatement, [userId])
      .then(([results]) =>
        results.map(({ url }) => url.replace('images/', 'images/thumbs/'))
      )
      .catch(failedQuery)
  }

  /**
   * @param {Object} params
   * @param {string} params.url
   * @returns {Promise<void>}
   */
  removeImageEntry({ url }) {
    const formattedUrl = url.replace('/thumbs', '')
    return this.sendQuery(deletePictureStatement, [formattedUrl]).catch(
      failedDeletion
    )
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
                user_id: result.follower_id,
                display_name: result.follower_display_name,
                first_name: result.follower_first_name,
                profile_picture_url: result.follower_picture ?? '',
                email: result.follower_email,
                email_opt_out: result.follower_email_opt
              }
            : {
                user_id: result.leader_id,
                display_name: result.leader_display_name,
                first_name: result.leader_first_name,
                profile_picture_url: result.leader_picture ?? '',
                email: result.leader_email,
                email_opt_out: result.leader_email_opt
              }
        )
      )
      .catch(failedQuery)
  }

  /**
   * @param {Object} params
   * @param {string} params.userEmail
   * @returns {Promise<string>} | a validation string that the user opt out variable was switched
   */
  switchEmailOpt({ userEmail }) {
    return this.sendQuery(optOutOfEmailStatement, [userEmail])
      .then(() => 'user opted out successfully')
      .catch(failedUpdate)
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise<number>} | return the device token for the user if it exists, otherwise null
   */
  getDeviceTokenPerUser({ userId }) {
    return this.sendQuery(selectDeviceTokenForUserStatement, [userId])
      .then(([results]) => (results.length ? results[0] : null))
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.fieldName
   * @param {string} params.fieldValue
   * @param {number} params.userId
   * @returns {Promise<void>} an update status
   */
  async updateDatabaseUser({ fieldName, fieldValue, userId }) {
    try {
      await this.sendQuery(updateUserStatement, [fieldName, fieldValue, userId])
      return 'update success'
    } catch (error) {
      throw failedUpdate(error)
    }
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
