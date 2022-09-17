const util = require('util')
const Multer = require('multer')
const { Storage } = require('@google-cloud/storage')

const { returnError, NOT_FOUND, SERVER_ERROR, sendResponse, SUCCESS, NOT_ACCEPTABLE, NO_CONTENT } = require('../ResponseHandling')
const { addUserPicture, addAdventurePicture, deleteUserPictures } = require('../DB')

const storage = new Storage({ keyFilename: 'google-cloud-key.json' })
const bucket = storage.bucket('backyard-image-storage')
const MAX_SIZE = 5 * 1024 * 1024

const processFile = Multer({
	storage: Multer.memoryStorage(),
	limits: { fileSize: MAX_SIZE }
}).single('image')

const processFileMiddleware = util.promisify(processFile)

const uploadPictures = async (req, res) => {
	try {
		const { id_from_token: user_id } = req.body
		const { adventure_id } = req.query
		
		await processFileMiddleware(req, res)

		if (!req.file) {
			throw returnError({ req, res, status: NOT_FOUND, message: 'Please upload a file!' })
		}

		const blob = bucket.file(req.file.originalname)
		const blobStream = blob.createWriteStream({ resumable: false })

		blobStream.on('finish', async () => {
			const publicUrl = util.format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)

            if (adventure_id) {
				await addAdventurePicture({
                    fileName: publicUrl,
                    user_id,
                    adventure_id
                })
            } else {
                await addUserPicture({ fileName: publicUrl, user_id })
            }

			return sendResponse({
				req,
				res,
				status: SUCCESS,
				data: {
					fileName: req.file.originalname,
					url: publicUrl
				}
			})
		})

		blobStream.end(req.file.buffer)
	} catch (error) {
		if (error.code === 'LIMIT_FILE_SIZE') {
			return returnError({
				req,
				res,
				status: NOT_ACCEPTABLE,
				message: 'File size cannot be larger than 3MB!',
                error
			})
		}

		return returnError({
			req,
			res,
			status: SERVER_ERROR,
			message: `Could not upload the file: ${req?.file?.originalname}. ${error.message}`,
            error: {
				code: error.code,
				...error
			}
		})
	}
}

const getListFiles = async (req, res) => {
	try {
		const [files] = await bucket.getFiles()
		const fileInfos = []

		files.forEach((file) => {
			fileInfos.push({
				name: file.name,
				url: file.metadata.mediaLink
			})
		})

		return sendResponse({ req, res, status: SUCCESS, data: fileInfos})
	} catch (error) {
		return returnError({
			req, res,
			status: SERVER_ERROR,
			message: 'Unable to read list of files!'
		})
	}
}

const download = async (req, res) => {
	try {
		const [metaData] = await bucket.file(req.query.name).getMetadata()
		return sendResponse({ req, res, status: SUCCESS, data: metaData.mediaLink })
	} catch (error) {
		return returnError({
			req,
			res,
			status: SERVER_ERROR,
			message: `Could not download the file: ${error.message}`
		})
	}
}

const deleteFiles = async (req, res) => {
	try {
		const { file_name: fileUrl } = req.body
		const fileUrlParsed = fileUrl.split('/')
		const fileName = fileUrlParsed[fileUrlParsed.length - 1]

		await deleteUserPictures({ file_name: fileUrl })
		await bucket.file(fileName).delete()

		return sendResponse({ req, res, status: NO_CONTENT, data: {} })
	} catch (error) {
		return returnError({
			req,
			res,
			status: SERVER_ERROR,
			message: 'Could not delete the file',
			error
		})
	}
}

module.exports = {
    processFile: processFileMiddleware,
	uploadPictures,
	getListFiles,
	download,
    deleteFiles
}