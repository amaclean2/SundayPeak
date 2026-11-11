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
  importBulkData,
  processCSV,
  getAdventuresByDistance,
  editPath,
  deletePath
} = require('../../Handlers/Adventures')
const { createTodoValidator } = require('../../Validators/TodoValidators')
const { createTodo } = require('../../Handlers/TodoAdventures')
const { createValidator } = require('../../Validators/ActivityValidators')
const { completeAdventure } = require('../../Handlers/CompletedAdventures')

const router = Router()

router.get('/all', adventuresGetValidator(), getAllAdventures)
router.get('/details', getAdventureDetails)
router.get('/distance', getAdventuresByDistance)
router.post('/', adventureCreateValidator(), createNewAdventure)
router.post('/todo', createTodoValidator(), createTodo)
router.post('/complete', createValidator(), completeAdventure)
router.post('/processCsv', processCSV)
router.post('/bulkImport', adventureBulkInsertValidator(), importBulkData)
router.put('/', adventureEditValidator(), editAdventure)
router.put('/path', editPath)
router.delete('/', deleteAdventure)
router.delete('/path', deletePath)

module.exports = router
