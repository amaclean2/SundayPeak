const { Router } = require('express')

const {
  adventureCreateValidator,
  adventuresGetValidator,
  adventureEditValidator,
  adventureBulkInsertValidator
} = require('../../Validators/AdventureValidators')
const {
  createNewAdventure,
  deleteAdventure,
  getAdventureDetails,
  getAllAdventures,
  editAdventure,
  searchAdventures,
  importBulkData,
  processCSV
} = require('../../Handlers/Adventures')
const { SUCCESS } = require('../../ResponseHandling/statuses')
const { adventureTypes } = require('../../Config/utils')

const router = Router()

router.post('/', adventureCreateValidator(), createNewAdventure)
router.get('/all', adventuresGetValidator(), getAllAdventures)
router.get('/details', getAdventureDetails)
router.get('/search', searchAdventures)
router.post('/processCsv', processCSV)
router.post('/bulkImport', adventureBulkInsertValidator(), importBulkData)
router.put('/', adventureEditValidator(), editAdventure)
router.delete('/', deleteAdventure)

router.get('/adventureTypes', (_, res) =>
  res.status(SUCCESS).json({ data: adventureTypes, status: SUCCESS })
)

module.exports = router
