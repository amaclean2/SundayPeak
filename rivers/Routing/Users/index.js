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
  refetchUser,
  editUser,
  getFriends,
  searchForFriends,
  searchAmongFriends
} = require('../../Handlers/Users')
const { Router } = require('express')

const router = Router()

router.get('/id', getUserById)
router.get('/loggedIn', getLoggedInUser)
router.get('/refetch', refetchUser)
router.get('/friends', getFriends)
router.get('/search', searchForFriends)
router.get('/friendSearch', searchAmongFriends)

router.post('/follow', userFollowValidator(), followUser)
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
