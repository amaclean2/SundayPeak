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
	searchAdventures,
	importBulkData,
	processCSV
} = require('../../Handlers/Adventures')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')

const router = Router()

router.post('/create', adventureCreateValidator(), createNewAdventure)
router.get('/all', adventuresGetValidator(), getAllAdventures)

router.get('/details', getAdventureDetails)
router.get('/search', searchAdventures)
router.post('/processCsv', processCSV)
router.post('/bulkImport', importBulkData)
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
