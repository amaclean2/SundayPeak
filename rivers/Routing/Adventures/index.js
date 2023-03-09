const { Router } = require('express')

const {
  adventureCreateValidator,
  adventuresGetValidator,
  adventureEditValidator
} = require('../../Validators/AdventureValidators')
const {
  createNewAdventure,
  deleteAdventure,
  getAdventureDetails,
  getAllAdventures,
  editAdventure,
  searchAdventures
} = require('../../Handlers/Adventures')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')

const router = Router()

router.get('/details', getAdventureDetails)
router.get('/search', searchAdventures)
router.get('/all', adventuresGetValidator(), getAllAdventures)
router.post('/create', adventureCreateValidator(), createNewAdventure)
router.put('/edit', adventureEditValidator(), editAdventure)
router.delete('/delete', deleteAdventure)

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    data: {
      message: 'Please select a method on /adventurtes',
      status: NOT_FOUND
    }
  })
})

module.exports = router
