const { userCreateValidator, userLoginValidator, userFollowValidator } = require('../../Validators/UserValidators')
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
	refetchUser
} = require('../../Handlers/Users')
const { Router } = require('express')

const router = Router()

router.get('/id', getUserById)
router.get('/loggedIn', getLoggedInUser)
router.post('/follow', userFollowValidator(), followUser)
router.get('/refetch', refetchUser)

router.post('/login', userLoginValidator(), loginUser)
router.post('/resetPassword', resetPassword)
router.post('/create', userCreateValidator(), createUser)
router.post('/savePasswordReset', savePasswordReset)

router.delete('/delete', deleteUser)

router.put('/edit', (req, res) => {
	res.status(NOT_FOUND).json({
		message: 'API to be created'
	})
})

router.use('/', (req, res) => {
	res.status(NOT_FOUND).json({
		message: 'Please select a method on /users',
		status: NOT_FOUND
	})
})

module.exports = router