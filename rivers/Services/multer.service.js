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
const { nanoid } = require('nanoid')

const storage = new Storage({ keyFilename: 'google-cloud-key.json' })
const bucket = storage.bucket('backyard-image-storage')

// max file size is 5MB
const MAX_SIZE = 5 * 1024 * 1024

const multerConfig = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE }
}).single('image')

const multerConfigPromisified = util.promisify(multerConfig)

const uploadPictureToStorage = (req, res, profile_image, isDefault) => {
  return new Promise((resolve, reject) => {
    try {
      multerConfigPromisified(req, res).then(async () => {
        if (!isDefault) {
          if (!req.file) {
            throw returnError({
              req,
              res,
              status: NOT_FOUND,
              message: 'Please upload a file!'
            })
          }
        }

        if (profile_image) {
          const profilePicture = await createProfilePicture(req.file)

          const profileBlob = bucket.file(profilePicture.originalname)
          const profileRemoteWriteStream = profileBlob.createWriteStream({
            resumable: false
          })

          profileRemoteWriteStream.on('finish', () => {
            const publicUrl = util.format(
              `https://storage.googleapis.com/${bucket.name}/${profileBlob.name}`
            )
            resolve({ publicUrl })
          })

          profileRemoteWriteStream.end(profilePicture.buffer)
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
          const defaultWriteStream = defaultBlob.createWriteStream({
            resumable: false
          })

          defaultWriteStream.on('finish', () => {
            const publicUrl = util.format(
              `https://storage.googleapis.com/${bucket.name}/${defaultBlob.name}`
            )
            resolve({ publicUrl })
          })

          defaultWriteStream.end(defaultPicture.buffer)
        } else {
          const fileName = nanoid(10)
          const thumb = await createThumb(req.file, fileName)
          const main = await createMain(req.file, fileName)

          const thumbBlob = bucket.file(thumb.originalname)
          const thumbRemoteWriteStream = thumbBlob.createWriteStream({
            resumable: false
          })

          const mainBlob = bucket.file(main.originalname)
          const mainRemoteWriteStream = mainBlob.createWriteStream({
            resumable: false
          })

          thumbRemoteWriteStream.on('finish', () => {
            const publicUrl = util.format(
              `https://storage.googleapis.com/${bucket.name}/${thumbBlob.name}`
            )
            resolve({ publicUrl })
          })

          thumbRemoteWriteStream.end(thumb.buffer)
          mainRemoteWriteStream.end(main.buffer)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

const deleteImageFromStorage = (fileName) => bucket.file(fileName).delete()

module.exports = {
  uploadPictureToStorage,
  deleteImageFromStorage
}
