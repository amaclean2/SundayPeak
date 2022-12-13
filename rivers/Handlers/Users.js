const { validationResult } = require('express-validator')
const { returnError } = require('../ResponseHandling')
const {
  CREATED,
  NO_CONTENT,
  SUCCESS,
  ACCEPTED
} = require('../ResponseHandling/statuses')
const cryptoHandlers = require('../Crypto')
const authService = require('../Services/auth.service')
const queries = require('../DB')
const { buildUserObject } = require('../Services/user.service')
const logger = require('../Config/logger')
const { sendResponse } = require('../ResponseHandling/success')
const {
  getMapboxAccessToken,
  getFirebaseApiKey
} = require('../Config/connections')
const {
  updateUser,
  getFriendsLookup,
  updatePassword,
  getFriendCreds,
  searchUsers,
  searchFriends
} = require('../DB')
const { uploadPictureToStorage } = require('../Services/multer.service')
const {
  sendResetPasswordMessage,
  sendUserFollowedMessage
} = require('../Services/email.service')

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return returnError({ req, res, error: errors.array()[0] })
    }

    const { email, password } = req.body

    const user = await buildUserObject({ req, res, initiation: { email } })

    if (cryptoHandlers.comparePassword(password, user.password)) {
      delete user.password
      const token = authService.issue({ id: user.id })

      logger.debug('USER_LOGGED_IN', user, token)

      return sendResponse({ req, res, data: { user, token }, status: SUCCESS })
    } else {
      return returnError({ req, res, message: 'invalidField' })
    }
  } catch (error) {
    return returnError({ req, res, message: 'serverLoginUser', error })
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.query
    if (!id) throw returnError({ req, res, message: 'idQueryRequired' })

    const userObject = await buildUserObject({
      req,
      res,
      initiation: { id: Number(id) }
    })
    delete userObject.password

    return sendResponse({
      req,
      res,
      data: { user: userObject },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverLoginUser', error })
  }
}

const refetchUser = async (req, res) => {
  try {
    const { id_from_token } = req.body
    const userObject = await buildUserObject({
      req,
      res,
      initiation: { id: id_from_token }
    })
    delete userObject.password

    return sendResponse({
      req,
      res,
      data: { user: userObject },
      status: SUCCESS
    })
  } catch (error) {
    throw returnError({ req, res, message: 'serverLoginUser', error })
  }
}

const getLoggedInUser = async (req, res) => {
  try {
    const { id_from_token } = req.body

    if (id_from_token) {
      const userObject = await buildUserObject({
        req,
        res,
        initiation: { id: id_from_token }
      })
      delete userObject.password

      return sendResponse({
        req,
        res,
        data: {
          user: userObject,
          mapbox_token: getMapboxAccessToken(),
          firebase_api_key: getFirebaseApiKey()
        },
        status: SUCCESS
      })
    } else {
      throw returnError({ req, res, message: 'notLoggedIn' })
    }
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'serverLoginUser',
      error
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }
    const { email } = req.body
    const { password: resetToken } = await buildUserObject({
      req,
      res,
      initiation: { email }
    })

    sendResetPasswordMessage({ email, resetToken })

    return sendResponse({
      req,
      res,
      data: {},
      status: NO_CONTENT
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidateUser', error })
  }
}

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const newUser = {
      ...req.body,
      password: cryptoHandlers.hashPassword(req.body.password)
    }

    const newUserId = await queries.addUser(newUser)
    const { publicUrl: defaultProfilePicture } = await uploadPictureToStorage(
      req,
      res,
      false,
      true
    )

    await updateUser({
      fields: [
        {
          field_name: 'profile_picture_url',
          field_value: defaultProfilePicture,
          user_id: newUserId
        }
      ]
    })

    const userObject = await buildUserObject({
      req,
      res,
      initiation: { id: newUserId }
    })

    const { id } = userObject
    const token = authService.issue({ id })
    delete userObject.password

    return sendResponse({
      req,
      res,
      data: { user: userObject, token },
      status: CREATED
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverCreateUser', error })
  }
}

const savePasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { user_id, password } = req.body

    const updatePasswordResponse = await updatePassword({
      newPassword: password,
      userId: user_id
    })

    logger.info(updatePasswordResponse)

    return sendResponse({
      req,
      res,
      data: {},
      status: NO_CONTENT
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidateUser', error })
  }
}

const getFriends = async (req, res) => {
  try {
    const { user_id } = req.query

    const friendsList = await getFriendsLookup({ userId: user_id })

    return sendResponse({
      req,
      res,
      data: { friends: friendsList, id: user_id },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'friends cannot be fetched at this time',
      error
    })
  }
}

const searchForFriends = async (req, res) => {
  try {
    const { queryString } = req.query
    const { id_from_token } = req.body

    if (!queryString || !queryString.length) {
      return sendResponse({
        req,
        res,
        data: { users: [], string: queryString },
        status: SUCCESS
      })
    }

    const matches = await searchUsers({
      keywords: queryString,
      userId: id_from_token
    })

    return sendResponse({
      req,
      res,
      data: { users: matches, string: queryString },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetFriends' })
  }
}

const searchAmongFriends = async (req, res) => {
  try {
    const { queryString } = req.query
    const { id_from_token } = req.body

    if (!queryString || !queryString.length) {
      return sendResponse({
        req,
        res,
        data: { users: [], string: queryString },
        status: SUCCESS
      })
    }

    const matches = await searchFriends({
      keywords: queryString,
      userId: id_from_token
    })

    return sendResponse({
      req,
      res,
      data: { users: matches, string: queryString },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetFriends' })
  }
}

const followUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { id_from_token, leader_id } = req.body

    await queries.followUser({ followerId: id_from_token, leaderId: leader_id })
    const newUserObject = await buildUserObject({
      req,
      res,
      initiation: { id: id_from_token }
    })

    // sends an email to the followed user that someone wants to be friends
    const {
      email: followedEmail,
      first_name: leaderFirstName,
      last_name: leaderLastName
    } = await getFriendCreds({
      followedId: leader_id
    })
    await sendUserFollowedMessage({
      email: followedEmail,
      followingUserName: `${newUserObject.first_name} ${newUserObject.last_name}`
    })

    return sendResponse({
      req,
      res,
      data: {
        user: newUserObject,
        leader_id,
        leader_name: `${leaderFirstName} ${leaderLastName}`,
        followed: true
      },
      status: ACCEPTED
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverFollowUser', error })
  }
}

const editUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { id_from_token, fields } = req.body

    const formattedFields = fields.map((field) => ({
      field_name: field.name,
      field_value: field.value,
      user_id: id_from_token
    }))

    logger.info({ formattedFields, fields })

    const updates = await updateUser({ fields: formattedFields })
    updates.forEach(logger.debug)

    return sendResponse({ req, res, data: {}, status: NO_CONTENT })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidationError', error })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id_from_token } = req.body
    await queries.deleteUser(id_from_token)

    res.status(NO_CONTENT).json({
      data: {}
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidateUser', error })
  }
}

module.exports = {
  loginUser,
  getUserById,
  refetchUser,
  getLoggedInUser,
  resetPassword,
  createUser,
  savePasswordReset,
  getFriends,
  searchForFriends,
  searchAmongFriends,
  followUser,
  editUser,
  deleteUser
}
