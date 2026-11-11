const fs = require('fs')
const Water = require('.')
const { handleEmailUserFollowed, handleNewUserEmail } = require('./utils/email')
const MessagingService = require('./messages.service')
const { comparePassword, hashPassword } = require('./utils/crypto')
const {
  createThumb,
  createMain,
  createProfilePicture,
  createDefaultProfilePicture,
  removeImage
} = require('./utils/sharp')
const logger = require('../Config/logger')
const { createAPNNotification } = require('./utils/notifications')

class UserService extends Water {
  constructor(sendQuery, jwtSecret) {
    super(sendQuery, jwtSecret)
    this.message = new MessagingService(sendQuery, jwtSecret)
  }

  /**
   * @private
   * @param {Object} params
   * @param {Object} params.initiation
   * @param {number} params.initiation.id
   * @param {string} params.initiation.email
   * @param {string} params.password | authenticate the password if provided
   * @param {Object} params.initiation.providedObject | if this is present then don't call the database to build the userObject
   * @returns {Promise<UserObject>}
   */
  async #buildUserObject({
    initiation: { id, email, providedObject },
    password
  }) {
    if (providedObject) {
      return {
        ...providedObject,
        friends: [],
        images: [],
        completed_adventures: [],
        todo_adventures: []
      }
    }

    let userObject
    let derivedId = id ?? null

    if (id) {
      userObject = await this.userDB.getUserById({ userId: id })
    } else if (email) {
      userObject = await this.userDB.getUserByEmail({ email })
      derivedId = userObject.id
    } else {
      throw 'to retrieve a user, an id or email is required in the initiation object'
    }

    if (!userObject) {
      throw "an account couldn't be found"
    }

    if (password && !comparePassword(password, userObject.password)) {
      throw 'The password is incorrect for this email. Please try again'
    }

    delete userObject.password

    const todoAdventures = await this.todoDB.getTodoAdventuresByUser({
      userId: derivedId
    })
    const completedAdventures = await this.completedDB.getCompletedAdventures({
      userId: derivedId
    })
    const friends = await this.userDB.getFriendsData({ userId: derivedId })
    const images = await this.userDB.getUserImages({ userId: derivedId })

    const returnObj = {
      ...userObject,
      friends,
      images,
      email_opt_out: !!userObject.email_opt_out,
      completed_adventures: completedAdventures.map((activity) => ({
        ...activity,
        user_id: activity.creator_id
      })),
      todo_adventures: todoAdventures.map((adventure) => ({
        ...adventure,
        user_id: adventure.creator_id
      }))
    }

    return returnObj
  }

  /**
   * @param {Object} params
   * @param {string} params.email | user email
   * @param {string} params.password | user password
   * @param {string} params.confirmPassword | verify intentional password
   * @param {string} params.firstName | user first_name
   * @param {string} params.lastName | user last_name
   * @param {boolean} params.native | stores in the token whether the connected client is an app or a web page
   * @param {function} testEmailCallback | don't send an actual email when testing
   * @returns {Promise<NewUserResponse>} an object containing a new user and a token
   */
  async addNewUser(
    {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      baseImageUrl,
      native
    },
    testEmailCallback
  ) {
    try {
      // native is a variable that identifies the user client
      if (!native) {
        logger.error(
          '`native` should be present anytime a new token is being created. This enables the server to process a token as a native device or a website'
        )
      }

      // if the passwords don't match, fail back to the client
      logger.info('checking password match')
      if (password !== confirmPassword) {
        throw 'passwords do not match'
      }

      // if the passwords aren't formatted correctly, fail back to the client
      if (password.length < 5 || password.length > 50) {
        throw 'password length must be between 5 and 50 characters'
      }

      // salt and hash the password so we don't store plain text passwords in our database
      const hashedPassword = hashPassword(password)

      // check if the user already exists, if so, fail back to the client
      logger.info('checking user exists')
      const userExists = await this.userDB.checkIfUserExistsByEmail({ email })
      if (userExists) {
        throw 'An account with this email aready exists. Please try a different email or login with that account.'
      }

      // if everything above checks out, create the user
      logger.info('service add new user')
      const { userId } = await this.userDB.addUserToDatabase({
        email,
        firstName,
        lastName,
        password: hashedPassword
      })

      logger.info(`userId returned: ${userId}`)

      // the user needs a picture for their profile, create a default one
      logger.info('creating default picture')
      let profileImageUrl
      if (process.env.NODE_ENV === 'production') {
        const { fileName } = await createDefaultProfilePicture({
          directory: process.env.FILE_STORAGE_PATH,
          userId
        })

        profileImageUrl = `${baseImageUrl}profile/${fileName}`

        // update the user with the picture
        await this.userDB.updateDatabaseUser({
          userId,
          fieldName: 'profile_picture_url',
          fieldValue: profileImageUrl
        })
      } else {
        // if this isn't a production environment, screw it
        profileImageUrl = ''
      }

      // build the new user object with the data provided
      const user = await this.#buildUserObject({
        initiation: {
          providedObject: {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            id: userId,
            profile_picture_url: profileImageUrl
          }
        }
      })

      // send a message to the user introducing them to the app
      logger.info('creating new introduction conversation')
      if (process.env.ADMIN_ID) {
        const { conversation_id } = await this.message.createConversation({
          userIds: [userId, process.env.ADMIN_ID]
        })

        await this.message.sendMessage({
          conversationId: conversation_id,
          senderId: process.env.ADMIN_ID,
          messageBody: fs.readFileSync(process.env.PATH_TO_INTRO_TEXT, 'utf-8'),
          dataReference: ''
        })
      } else {
        logger.info('skip creating an intro message for testing')
      }

      // if this is a test environment, don't send an email
      const callback = testEmailCallback ?? handleNewUserEmail

      // send an email to the new user indicating an account was created
      callback({
        email,
        displayName: `${firstName} ${lastName}`
      })

      // issue an auth token for the new session
      const authToken = this.auth.issue({ id: userId, native: native ?? false })

      logger.info('auth token created')

      // return the user and the auth token
      return {
        user,
        token: authToken
      }
    } catch (error) {
      logger.error(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.password
   * @param {string} params.email
   * @param {boolean} params.native | stores in the token whether the connected client is an app or a web page
   * @returns {Promise<NewUserResponse>} an object with the user and a token
   */
  async loginWithEmailAndPassword({ email, password, native }) {
    const checkUser = await this.userDB.checkIfUserExistsByEmail({ email })

    if (!checkUser)
      throw 'There was no user found with that email. Please try again or create a new user.'

    const user = await this.#buildUserObject({
      initiation: { id: checkUser },
      password
    })
    const token = this.auth.issue({ id: user.id, native })
    return { user, token }
  }

  /**
   * @param {Object} params
   * @param {string} params.url
   * @param {string} params.token
   * @returns {Promise<UserObject>}
   */
  getPresignedInUser({ userId }) {
    if (!userId) {
      throw 'user is not logged in'
    }

    return this.#buildUserObject({ initiation: { id: userId } })
  }

  /**
   * @param {Object} params
   * @param {number} params.id | user id required to get user
   * @returns {Promise<UserObject>}
   */
  async getUserFromId({ userId }) {
    try {
      const user = await this.#buildUserObject({ initiation: { id: userId } })
      delete user.phone
      return user
    } catch (error) {
      logger.info(error)
      throw error
    }
  }

  /**
   * @param {Object} ids
   * @param {number} ids.leaderId | the user being followed
   * @param {number} ids.followerId | the user following
   * @param {FriendEmailCallback} [testEmailCallback] | in jest this can be replaced with a mock
   * @returns {Promise<UserObject>} the following user with the new friends list
   */
  async friendUser(ids, testEmailCallback) {
    // follow the new user
    await this.userDB.createUserFollowing(ids)

    // rebuild the user object
    const user = await this.#buildUserObject({
      initiation: { id: ids.followerId }
    })

    // get the followed user
    const newFriend = user.friends.find(
      ({ user_id }) => user_id == ids.leaderId
    )

    // if this is a test case, don't actually send an email
    const callback = testEmailCallback ?? handleEmailUserFollowed

    // if the user opted out of emails, don't send an email
    if (!newFriend.email_opt_out) {
      await callback({
        email: newFriend.email,
        displayName: newFriend.display_name,
        followerDisplayName: `${user.first_name} ${user.last_name}`
      })
    }

    // get the apns device token for the receiving user
    const dt = await this.userDB.getDeviceTokenPerUser({
      userId: newFriend.user_id
    })

    // if this isn't a test case, send a notification to the receiving user but only if there was a device token returned
    if (!testEmailCallback && !!dt) {
      createAPNNotification({
        messageBody: `${user.first_name} ${user.last_name} has followed you`,
        deviceTokens: [dt]
      })
    }

    return user
  }

  /**
   * @param {Object} params
   * @param {string} params.userEmail
   * @returns {Promise<string>}
   */
  async optOutOfEmail({ userEmail }) {
    try {
      if (!userEmail) throw 'userId field is required'

      const resp = await this.userDB.switchEmailOpt({ userEmail })

      logger.info(resp)
      return resp
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.userId | the id of the user to update
   * @param {string} params.fieldName | the field to update
   * @param {string} params.fieldValue | the new value
   * @return {Promise<void>}
   */
  editUser({ userId, fieldName, fieldValue }) {
    return this.userDB.updateDatabaseUser({ fieldName, fieldValue, userId })
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @return {Promise<void>}
   */
  deleteUser({ userId }) {
    return this.userDB.databaseDeleteUser({ userId })
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @param {boolean} params.isPublic
   * @param {string} params.adventureType
   * @param {string} params.rating
   * @param {string} params.difficulty
   * @returns {Promise<CompletedResponse>}
   */
  completeAdventure({
    userId,
    adventureId,
    isPublic,
    adventureType,
    rating,
    difficulty
  }) {
    let response = null
    return this.todoDB
      .removeTodoAdventure({ adventureId, userId })
      .then(() =>
        this.completedDB.completeAdventure({ userId, adventureId, isPublic })
      )
      .then((completionResponse) => {
        response = completionResponse
        return this.adventureDB.databaseEditAdventure({
          field: {
            name: 'difficulty',
            value: difficulty,
            adventure_id: adventureId,
            adventure_type: adventureType
          }
        })
      })
      .then(() =>
        this.adventureDB.databaseEditAdventure({
          field: {
            name: 'rating',
            value: rating,
            adventure_id: adventureId,
            adventure_type: adventureType
          }
        })
      )
      .then(() => response)
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @param {boolean} params.isPublic
   * @returns {Promise<TodoResponse>}
   */
  addAdventureTodo({ userId, adventureId, isPublic }) {
    return this.todoDB.createNewTodoAdventure({ userId, adventureId, isPublic })
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.url
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @returns {Promise<void>}
   */
  async saveImage({ file, url, userId, adventureId, profilePicture }) {
    if (!userId || !url) {
      throw 'userId and url parameters are required'
    }

    if (profilePicture && adventureId) {
      throw 'this picture can only be saved either to an adventure or as a profile picture'
    }

    if (profilePicture !== undefined) {
      await createProfilePicture({ file })
      return this.userDB.updateDatabaseUser({
        fieldName: 'profile_picture_url',
        fieldValue: url,
        userId
      })
    }

    await createThumb({ file })
    await createMain({ file })

    return adventureId !== undefined
      ? this.adventureDB.saveImageToAdventure({ url, userId, adventureId })
      : this.userDB.saveImageToUser({ url, userId })
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.url
   * @returns {Promise<void>}
   */
  removeGalleryImage({ url }) {
    return removeImage({ url }).then(() =>
      this.userDB.removeImageEntry({ url })
    )
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.oldUrl
   * @param {number} params.userId
   * @returns {Promise<void>}
   */
  async removeProfileImage({ userId, oldUrl }) {
    try {
      await removeImage({ url: oldUrl })
      const { fileName } = await createDefaultProfilePicture({
        directory: process.env.FILE_STORAGE_PATH,
        userId
      })
      await this.userDB.updateDatabaseUser({
        userId,
        fieldName: 'profile_picture_url',
        fieldValue: `${oldUrl.split('/profile').shift()}/profile/${fileName}`
      })
    } catch (error) {
      logger.info(error)
      throw error
    }
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.url
   * @param {number} params.userId
   * @param {string} params.oldUrl
   * @param {File} params.file
   * @returns {Promise<void>}
   */
  async changeProfileImage({ userId, file, url, oldUrl }) {
    try {
      const response = await removeImage({ url: oldUrl })

      if (Array.isArray(response)) {
        response.forEach((resp) => logger.info(resp))
      } else {
        logger.info(response)
      }

      await createProfilePicture({ file })
      await this.userDB.updateDatabaseUser({
        userId,
        fieldName: 'profile_picture_url',
        fieldValue: url
      })
    } catch (error) {
      logger.error(error)
      throw error
    }
  }
}

module.exports = UserService
