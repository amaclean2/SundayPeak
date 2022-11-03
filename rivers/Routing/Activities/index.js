const { Router } = require('express')
const {
  getActivitiesByAdventure,
  createActivity
} = require('../../Handlers/Activities')
const { sendResponse } = require('../../ResponseHandling')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')
const {
  getValidatorByAdventure,
  createValidator
} = require('../../Validators/ActivityValidators')

const router = Router()

router.get('/byAdventure', getValidatorByAdventure(), getActivitiesByAdventure)
router.post('/create', createValidator(), createActivity)

router.use('/', (req, res) => {
  return sendResponse({
    req,
    res,
    status: NOT_FOUND,
    data: { message: 'Please select a message on /activities' }
  })
})

module.exports = router
