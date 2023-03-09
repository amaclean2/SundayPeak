const {
  userCreateValidator,
  userLoginValidator,
  userFollowValidator,
  userEditValidator,
  passwordResetValidator,
  newPasswordValidator
} = require('../../Validators/UserValidators')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')
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
  searchAmongFriends,
  searchAmongUsers
} = require('../../Handlers/Users')
const { Router } = require('express')

const router = Router()

router.get('/id', getUserById)
router.get('/loggedIn', getLoggedInUser)
router.get('/search', searchAmongUsers)
router.get('/friendSearch', searchAmongFriends)
router.get('/follow', followUser)

router.post('/login', userLoginValidator(), loginUser)
router.post('/passwordResetLink', passwordResetValidator(), resetPassword)
router.post('/create', userCreateValidator(), createUser)
router.post('/newPassword', newPasswordValidator(), savePasswordReset)

router.put('/edit', userEditValidator(), editUser)
router.delete('/delete', deleteUser)

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    message: 'Please select a method on /users',
    status: NOT_FOUND
  })
})

module.exports = router
