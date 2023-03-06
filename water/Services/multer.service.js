const util = require('util')
const Multer = require('multer')
const { Storage } = require('@google-cloud/storage')
const {
  returnError,
  NOT_FOUND,
  NOT_ACCEPTABLE
} = require('../ResponseHandling')
const {
  createThumb,
  createMain,
  createProfilePicture,
  createDefaultProfilePicture
} = require('./sharp.service')
const logger = require('../Config/logger')

const storage = new Storage({ keyFilename: 'google-cloud-key.json' })
const bucket = storage.bucket('sunday-application-images')
const storageUrl = `https://storage.googleapis.com/${bucket.name}`
const localLocation = './public/uploads/'

// max file size is 5MB
// const MAX_SIZE = 5 * 1024 * 1024

const multerConfig = Multer({
  storage:
    process.env.NODE_ENV === 'prod'
      ? Multer.memoryStorage()
      : Multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, localLocation)
          },
          filename: (req, file, cb) => {
            cb(null, file.originalname)
          }
        })
  // limits: { fileSize: MAX_SIZE }
}).single('image')

const multerConfigPromisified = util.promisify(multerConfig)

const writeToStorage = (blob, buffer) => {
  return new Promise((res) => {
    let writeStream
    if (process.env.NODE_ENV === 'dev') {
      logger.info('Image written to local storage')
    } else {
      writeStream = blob.createWriteStream({
        resumable: false
      })

      writeStream.on('finish', () => {
        const publicUrl = util.format(`${storageUrl}/${blob.name}`)

        res(publicUrl)
      })

      writeStream.end(buffer)
    }
  })
}

/**
 *
 * @param {Request} req | express request object
 * @param {Response} res | express response object
 * @param {boolean} profile_image | a boolean defining whether the uploaded image is a profile image
 * @param {boolean} isDefault | a boolean defining whether the uploaded image is the default image
 * @returns {Promise} the new url of the uploaded picture
 */
const uploadPictureToStorage = (req, res, profile_image, isDefault) => {
  multerConfigPromisified(req, res).then(async () => {
    if (!isDefault) {
      if (!req.file) {
        throw returnError({
          req,
          res,
          status: NOT_FOUND,
          message: 'Please upload a file'
        })
      }
    }

    if (!process.env.NODE_ENV === 'prod') {
      return
    }

    if (profile_image) {
      const profilePicture = await createProfilePicture(req.file)

      const profileBlob = bucket.file(profilePicture.originalname)
      const publicUrl = await writeToStorage(profileBlob, profilePicture.buffer)

      return { publicUrl }
    } else if (isDefault) {
      if (!req.body.first_name || !req.body.last_name) {
        throw returnError({
          req,
          res,
          status: NOT_ACCEPTABLE,
          message: 'First name and last name fields are required'
        })
      }
      const defaultPicture = await createDefaultProfilePicture({
        userFirstName: req.body.first_name,
        userLastName: req.body.last_name
      })

      const defaultBlob = bucket.file(defaultPicture.originalname)
      const publicUrl = await writeToStorage(defaultBlob, defaultPicture.buffer)

      return { publicUrl }
    } else {
      logger.info({ file: req.file })
      const thumb = await createThumb(req.file)
      const main = await createMain(req.file)

      const thumbBlob = bucket.file(thumb.originalname)

      const mainBlob = bucket.file(main.originalname)
      const [mainUrl, thumbUrl] = await Promise.all([
        writeToStorage(mainBlob, main.buffer),
        writeToStorage(thumbBlob, thumb.buffer)
      ])

      return { publicUrl: thumbUrl, mainUrl }
    }
  })
}

const deleteImageFromStorage = (fileName) => bucket.file(fileName).delete()

module.exports = {
  uploadPictureToStorage,
  deleteImageFromStorage
}
