const { nanoid } = require('nanoid')

const { returnError } = require('../ResponseHandling')
const { NO_CONTENT } = require('../ResponseHandling/statuses')
const { addAdventurePicture, addUserPicture, deleteUserPictures } = require('../DB/Pictures')
const { uploadHandler } = require('../Config/dataStore')
const logger = require('../Config/logger')

const uploadPictures = async (req, res) => {
	try {
		const bucket = ''
		const endpoint = ''
        
		const fileId = nanoid()
		const prefix = `https://${bucket}.${endpoint}/`
		req.file_id = fileId

		await addUserPicture({ fileName: `${prefix}${fileId}`, userId: req.body.id_from_token })

		uploadHandler(req, res)
	} catch (error) {
		return returnError({ req, res, error, message: 'serverUploadPictures' })
	}
}

const uploadAdventurePictures = async (req, res) => {
	try {
		const bucket = ''
		const endpoint = ''
        
		const { adventure_id } = req.query
		const fileId = nanoid()
		const prefix = `https://${bucket}.${endpoint}/`
		req.file_id = fileId

		await addAdventurePicture({
			fileName: `${prefix}${fileId}`,
			userId: req.body.id_from_token,
			adventureId: adventure_id
		})

		uploadHandler(req, res)
	} catch (error) {
		return returnError({ req, res, error, message: 'serverUploadPictures' })
	}
}

const deletePictures = async (req, res) => {
	const { file_name } = req.body
	const bucket = ''

	try {
		const resp = await deleteUserPictures({ file_name })
		s3.deleteObject({ Bucket: bucket, Key: file_name.split('.com/')[1] }, (error, data) => {
			if (error) {
				logger.error('S3_DELETION', error)
				throw error
			}

			logger.debug('PICTURE_DELETION', resp, data)

			res.status(NO_CONTENT).json({
				data: {}
			})
		})

	} catch (error) {
		return returnError({ req, res, error, message: 'serverUploadPictures' })
	}
}

module.exports = {
	uploadPictures,
	uploadAdventurePictures,
	deletePictures
}