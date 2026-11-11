const multer = require('multer')
const util = require('util')

const {
  CREATED,
  SUCCESS,
  NOT_ACCEPTABLE
} = require('../ResponseHandling/statuses')

const serviceHandler = require('../Config/services')
const { buildImageUrl } = require('./utils')
const {
  sendResponse,
  returnError,
  SERVER_ERROR
} = require('../ResponseHandling')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_STORAGE_PATH)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/ /g, ''))
  }
})

const filter = (req, file, cb) => {
  cb(null, true)
}

const uploadPromisified = util.promisify(
  multer({ storage, fileFilter: filter }).single('image')
)

const handleSaveImage = async (req, res) => {
  try {
    // userId needs to be pulled before multer acts on the request
    const userId = req.body.id_from_token

    req.logger.info('saving image')

    await uploadPromisified(req, res)

    const {
      file,
      body: { adventure_id, profile_picture }
    } = req

    if (!file) {
      throw `File required in image upload request, received ${file}.`
    }

    const baseImageUrl = buildImageUrl(req)
    const profileImageDirectory = profile_picture ? 'profile/' : ''
    const url =
      `${baseImageUrl}${profileImageDirectory}${file.originalname}`.replace(
        / /g,
        ''
      )

    await serviceHandler.userService.saveImage({
      file,
      url,
      userId,
      adventureId: adventure_id,
      profilePicture: profile_picture
    })

    // make sure the url sent back to the client is the thumb url
    // since the url is generated above and not in 'Water' then
    // it's fair to modify it here
    return sendResponse({
      req,
      res,
      data: {
        message: 'Picture uploaded',
        path: url.replace('/images', '/images/thumbs')
      },
      status: CREATED
    })
  } catch (error) {
    return returnError({ req, res, status: SERVER_ERROR, error })
  }
}

const deletePicture = async (req, res) => {
  try {
    const { url } = req.body

    if (url === undefined || typeof url !== 'string') {
      throw `URL parameter: ${url} is incorrect`
    }

    req.logger.info('deleting picture')

    await serviceHandler.userService.removeGalleryImage({ url })

    return sendResponse({
      req,
      res,
      data: { message: 'Picture removed' },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, status: NOT_ACCEPTABLE, error })
  }
}

const deleteProfilePicture = async (req, res) => {
  const userId = req.body.id_from_token
  const oldUrl = req.body.old_url

  if (!userId || !oldUrl) {
    throw 'userId and the profile picture url are required to delete the picture'
  }

  req.logger.info('deleting profile picture')

  await serviceHandler.userService.removeProfileImage({ userId, oldUrl })

  return sendResponse({
    req,
    res,
    data: { message: 'Picture removed' },
    status: SUCCESS
  })
}

const changeProfilePicture = async (req, res) => {
  try {
    const userId = req.body.id_from_token

    await uploadPromisified(req, res)

    req.logger.info(`Image has been uploaded: ${req.file.originalname}`)

    const {
      file,
      body: { previous_profile_url }
    } = req

    const baseImageUrl = buildImageUrl(req)

    const newFilePath = `${baseImageUrl}profile/${file.originalname}`.replace(
      / /g,
      ''
    )
    const url = newFilePath

    await serviceHandler.userService.changeProfileImage({
      userId,
      file,
      url,
      oldUrl: previous_profile_url
    })

    return sendResponse({
      req,
      res,
      data: { message: 'Profile picture changed', path: url },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, status: SERVER_ERROR, error })
  }
}

module.exports = {
  handleSaveImage,
  deletePicture,
  deleteProfilePicture,
  changeProfilePicture
}
