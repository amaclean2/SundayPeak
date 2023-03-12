const Water = require('.')
const { handleEmailUserFollowed } = require('./utils/email')
const SearchService = require('./search.service')
const { comparePassword, hashPassword } = require('./utils/crypto')
const logger = require('../Config/logger')

class UserService extends Water {
  constructor(sendQuery, jwtSecret) {
    super(sendQuery, jwtSecret)
    this.search = new SearchService(sendQuery, jwtSecret)
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
    let derivedId = id ? id : null

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
      throw 'passwordNotFound'
    }

    delete userObject.password

    const todoAdventures = await this.todoDB.getTodoAdventuresByUser({
      userId: derivedId
    })
    const completedAdventures = await this.completedDB.getCompletedAdventures({
      userId: derivedId
    })
    const friends = await this.userDB.getFriendsData({ userId: derivedId })
    // const images = (await getUserPictures({ userId: derivedId })) || []
    const images = []

    const returnObj = {
      ...userObject,
      friends,
      images,
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
   * @returns {Promise<NewUserResponse>} an object containing a new user and a token
   */
  addNewUser({ email, password, confirmPassword, firstName, lastName }) {
    if (password !== confirmPassword) {
      throw 'passwords do not match'
    }
    if (password.length < 5 || password.length > 50) {
      throw 'password length must be between 5 and 50 characters'
    }

    const hashedPassword = hashPassword(password)
    return this.userDB
      .checkIfUserExistsByEmail({ email })
      .then((userExists) => {
        if (!userExists) {
          return true
        } else {
          throw 'An account with this email aready exists. Please try a different email or login with that account.'
        }
      })
      .then(() =>
        this.userDB.addUserToDatabase({
          email,
          firstName,
          lastName,
          password: hashedPassword
        })
      )
      .then((newUserId) =>
        this.#buildUserObject({
          initiation: {
            providedObject: {
              email,
              password,
              first_name: firstName,
              last_name: lastName,
              id: newUserId
            }
          }
        })
      )
      .then((user) => {
        this.search.saveUserKeywords({
          searchableFields: user,
          userId: user.id
        })
        return { user, token: this.auth.issue({ id: user.id }) }
      })
  }

  /**
   * @param {Object} params
   * @param {string} params.password
   * @param {string} params.email
   * @returns {Promise<NewUserResponse>} an object with the user and a token
   */
  async loginWithEmailAndPassword({ email, password }) {
    const checkUser = await this.userDB.checkIfUserExistsByEmail({ email })

    if (!checkUser)
      throw 'There was no user found with that email. Please try again or create a new user.'

    const user = await this.#buildUserObject({
      initiation: { id: checkUser },
      password
    })
    const token = this.auth.issue({ id: user.id })
    return { user, token }
  }

  /**
   * @param {Object} params
   * @param {string} params.url
   * @param {string} params.token
   * @returns {Promise<UserObject>}
   */
  getPresignedInUser({ url, token }) {
    return this.auth
      .validate({ originalUrl: url, token })
      .then(({ idFromToken: userId }) => {
        if (!userId) {
          throw 'user is not logged in'
        }

        return this.#buildUserObject({ initiation: { id: userId } })
      })
  }

  /**
   * @param {Object} params
   * @param {number} params.id | user id required to get user
   * @returns {Promise<UserObject>}
   */
  getUserFromId({ userId }) {
    return this.#buildUserObject({ initiation: { id: userId } }).then(
      (user) => {
        delete user.phone
        return user
      }
    )
  }

  /**
   * @param {*} params
   * @param {string} params.searchString | the string to use in the search
   * @returns {Promise<UserObject[]>} | an array of users that match the search text
   */
  searchForUsers({ searchString }) {
    if (!searchString?.length) return []

    return this.search.userSearch({ keystring: searchString })
  }

  /**
   * @param {*} params
   * @param {string} params.searchString | the string to use in the search
   * @param {number} params.userId | the is of the user to search for friends of
   * @returns {Promise<UserObject[]>} an array of friends that match the search text
   */
  searchForFriends({ searchString, userId }) {
    if (!searchString?.length) return []

    return this.search.userSearch({ keystring: searchString, userId })
  }

  /**
   * @param {Object} ids
   * @param {number} ids.leaderId | the user being followed
   * @param {number} ids.followerId | the user following
   * @param {FriendEmailCallback} [testEmailCallback] | in jest this can be replaced with a mock
   * @returns {Promise<UserObject>} the following user with the new friends list
   */
  friendUser(ids, testEmailCallback) {
    return this.userDB.createUserFollowing(ids).then(() =>
      this.#buildUserObject({ initiation: { id: ids.followerId } }).then(
        (user) => {
          const newFriend = user.friends.find(({ id }) => id === ids.leaderId)

          const callback = testEmailCallback || handleEmailUserFollowed

          return callback({
            email: newFriend.email,
            followingUserName: newFriend.display_name
          }).then(() => user)
        }
      )
    )
  }

  /**
   * @param {Object} params
   * @param {number} params.userId | the id of the user to update
   * @param {string} params.fieldName | the field to update
   * @param {string} params.fieldValue | the new value
   * @return {Promise<void>}
   */
  editUser({ userId, fieldName, fieldValue }) {
    return this.userDB
      .updateDatabaseUser({ fieldName, fieldValue, userId })
      .then((updatedUser) =>
        this.search.saveUserKeywords({ searchableFields: updatedUser, userId })
      )
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
   * @returns {Promise<CompletedResponse>}
   */
  completeAdventure({ userId, adventureId, isPublic }) {
    return this.todoDB
      .removeTodoAdventure({ adventureId, userId })
      .then(() =>
        this.completedDB.completeAdventure({ userId, adventureId, isPublic })
      )
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
}

module.exports = UserService
