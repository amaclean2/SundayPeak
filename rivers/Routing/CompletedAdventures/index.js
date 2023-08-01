const { Router } = require('express')
const { completeAdventure } = require('../../Handlers/CompletedAdventures')
const { createValidator } = require('../../Validators/ActivityValidators')

const router = Router()

router.post('/', createValidator(), completeAdventure)

module.exports = router
