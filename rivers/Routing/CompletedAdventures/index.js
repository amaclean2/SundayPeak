const { Router } = require('express')
const { completeAdventure } = require('../../Handlers/CompletedAdventures')
const { sendResponse } = require('../../ResponseHandling')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')
const { createValidator } = require('../../Validators/ActivityValidators')

const router = Router()

router.post('/create', createValidator(), completeAdventure)

router.use('/', (req, res) => {
  return sendResponse({
    req,
    res,
    status: NOT_FOUND,
    data: { message: 'Please select a message on /created_adventures' }
  })
})

module.exports = router
