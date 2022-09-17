const { Router } = require('express')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')
const { uploadPictures, deleteFiles } = require('../../Services/pictures.service')

const router = Router()

router.post('/userUpload', (req, res) => uploadPictures(req, res, 'user'))
router.post('/adventureUpload', (req, res) => uploadPictures(req, res, 'adventure'))
router.post('/delete', deleteFiles)

router.use('/', (req, res) => {
	res.status(NOT_FOUND).json({
		data: {
			message: 'Please select a method on /pictures',
			status: NOT_FOUND
		}
	})
})

module.exports = router