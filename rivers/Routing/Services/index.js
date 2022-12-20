const { Router } = require('express')
const { getLoggedInUser } = require('../../Handlers/Users')
const { sendResponse } = require('../../ResponseHandling')
const { NOT_FOUND, SUCCESS } = require('../../ResponseHandling/statuses')
const { getAccessoryInformation } = require('../../Services/utils')

const router = Router()

router.get('/initial', (req, res) => {
  if (req.body.id_from_token) return getLoggedInUser(req, res)
  else {
    return sendResponse({
      req,
      res,
      data: {
        user: false,
        ...getAccessoryInformation({ user: false })
      },
      status: SUCCESS
    })
  }
})

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    data: {
      messasge: 'Please select a method on /services',
      status: NOT_FOUND
    }
  })
})

module.exports = router
