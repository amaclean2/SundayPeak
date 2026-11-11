const {
  userCreateValidator,
  userLoginValidator,
  userEditValidator,
  passwordResetValidator,
  newPasswordValidator
} = require('../../Validators/UserValidators')
const {
  createUser,
  deleteUser,
  followUser,
  getLoggedInUser,
  getUserById,
  loginUser,
  resetPassword,
  savePasswordReset,
  editUser,
  emailOptOut
} = require('../../Handlers/Users')
const { Router } = require('express')

const router = Router()

router.get('/id', getUserById)
router.get('/loggedIn', getLoggedInUser)
router.get('/follow', followUser)
router.get('/emailOptOut', emailOptOut)

router.post('/', userCreateValidator(), createUser)
router.post('/login', userLoginValidator(), loginUser)
router.post('/passwordResetLink', passwordResetValidator(), resetPassword)
router.post('/newPassword', newPasswordValidator(), savePasswordReset)

router.put('/', userEditValidator(), editUser)
router.delete('/', deleteUser)

module.exports = router
