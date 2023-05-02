const multer = require('multer')
const util = require('util')

const { CREATED, SUCCESS } = require('../ResponseHandling/statuses')

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
    cb(null, file.originalname)
  }
})

const filter = (req, file, cb) => {
  cb(null, true)
}

const uploadPromisified = util.promisify(
  multer({ storage, fileFilter: filter }).single('image')
)

const handleSaveImage = async (req, res) => {
  // userId needs to be pulled before multer acts on the request
  const userId = req.body.id_from_token

  await uploadPromisified(req, res)

  const {
    file,
    body: { adventure_id, profile_picture }
  } = req

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

  return sendResponse({
    req,
    res,
    data: { message: 'Picture uploaded', path: url },
    status: CREATED
  })
}

const deletePicture = async (req, res) => {
  const { url } = req.query

  await serviceHandler.userService.removeGalleryImage({ url })

  return sendResponse({
    req,
    res,
    data: { message: 'Picture removed' },
    status: SUCCESS
  })
}

const deleteProfilePicture = async (req, res) => {
  const userId = req.body.id_from_token
  const oldUrl = req.body.old_url

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

    const {
      file,
      body: { previous_profile_url }
    } = req

    const baseImageUrl = buildImageUrl(req)
    const url = `${baseImageUrl}profile/${file.originalname}`.replace(/ /g, '')

    await serviceHandler.userService.changeProfileImage({
      userId,
      file,
      url,
      oldUrl: previous_profile_url
    })

    return sendResponse({
      req,
      res,
      data: { message: 'Profile picture changed' },
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
