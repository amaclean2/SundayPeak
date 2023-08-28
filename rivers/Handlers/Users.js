const { validationResult } = require('express-validator')
const { returnError } = require('../ResponseHandling')
const {
  NO_CONTENT,
  SUCCESS,
  ACCEPTED,
  CREATED
} = require('../ResponseHandling/statuses')
const { sendResponse } = require('../ResponseHandling/success')

const serviceHandler = require('../Config/services')
const { buildImageUrl } = require('./utils')

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { email, password, first_name, last_name, password_2 } = req.body

    const newUserResponse = await serviceHandler.userService.addNewUser({
      email,
      password,
      confirmPassword: password_2,
      firstName: first_name,
      lastName: last_name,
      baseImageUrl: buildImageUrl()
    })

    return sendResponse({ req, res, data: newUserResponse, status: CREATED })
  } catch (error) {
    return returnError({
      req,
      res,
      message: typeof error === 'string' ? error : 'serverCreateUser',
      error
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { email, password } = req.body

    const loginUserResponse =
      await serviceHandler.userService.loginWithEmailAndPassword({
        email,
        password
      })

    return sendResponse({ req, res, data: loginUserResponse, status: SUCCESS })
  } catch (error) {
    if (typeof error === 'string') {
      return returnError({
        req,
        res,
        message: error
      })
    } else {
      return returnError({ req, res, message: 'serverLoginUser', error })
    }
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.query
    if (!id) throw returnError({ req, res, message: 'idQueryRequired' })

    const retrievedUser = await serviceHandler.userService.getUserFromId({
      userId: id
    })

    return sendResponse({
      req,
      res,
      data: { user: retrievedUser },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverLoginUser', error })
  }
}

const getLoggedInUser = async (req, res) => {
  try {
    const { id_from_token } = req.body
    const loggedInUser = await serviceHandler.userService.getPresignedInUser({
      userId: id_from_token
    })

    return sendResponse({
      req,
      res,
      data: { user: loggedInUser },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverLoginUser', error })
  }
}

const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }
    const { email } = req.body
    await serviceHandler.passwordService.sendPasswordResetEmail({ email })

    return sendResponse({
      req,
      res,
      data: { message: 'password reset email sent successfully' },
      status: NO_CONTENT
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidateUser', error })
  }
}

const savePasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { user_id, password, reset_token } = req.body
    const updatePasswordResponse =
      await serviceHandler.passwordService.saveNewPassword({
        newPassword: password,
        userId: user_id,
        resetToken: reset_token
      })

    return sendResponse({
      req,
      res,
      data: { message: updatePasswordResponse },
      status: NO_CONTENT
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidateUser', error })
  }
}

const searchAmongUsers = async (req, res) => {
  try {
    const { search } = req.query

    const users = await serviceHandler.userService.searchForUsers({
      searchString: search
    })

    return sendResponse({
      req,
      res,
      data: { users, search },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetFriends' })
  }
}

const searchAmongFriends = async (req, res) => {
  try {
    const { search } = req.query
    const { id_from_token } = req.body

    const users = await serviceHandler.userService.searchForFriends({
      searchString: search,
      userId: id_from_token
    })

    return sendResponse({
      req,
      res,
      data: { users, search },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetFriends' })
  }
}

const followUser = async (req, res) => {
  try {
    const { id_from_token } = req.body
    const { leader_id } = req.query

    const followResponse = await serviceHandler.userService.friendUser({
      leaderId: Number(leader_id),
      followerId: id_from_token
    })

    return sendResponse({
      req,
      res,
      data: {
        user: followResponse,
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

    const {
      id_from_token: userId,
      field: { name: fieldName, value: fieldValue }
    } = req.body

    await serviceHandler.userService.editUser({
      userId,
      fieldName,
      fieldValue
    })

    return sendResponse({ req, res, data: {}, status: NO_CONTENT })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidateUser', error })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id_from_token } = req.body
    await serviceHandler.userService.deleteUser({ userId: id_from_token })

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
  getLoggedInUser,
  resetPassword,
  createUser,
  savePasswordReset,
  searchAmongUsers,
  searchAmongFriends,
  followUser,
  editUser,
  deleteUser
}
