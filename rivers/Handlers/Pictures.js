const {
  addAdventurePicture,
  addUserPicture,
  deleteUserPictures,
  updateUser,
  deleteProfilePicture
} = require('../DB')
const {
  returnError,
  sendResponse,
  SUCCESS,
  NOT_ACCEPTABLE,
  SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND
} = require('../ResponseHandling')
const {
  uploadPictureToStorage,
  deleteImageFromStorage
} = require('../Services/multer.service')

const uploadPictures = async (req, res) => {
  try {
    const { id_from_token: user_id } = req.body
    const { adventure_id, profile_image } = req.query

    const { publicUrl } = await uploadPictureToStorage(req, res, profile_image)

    if (adventure_id) {
      await addAdventurePicture({
        fileName: publicUrl,
        user_id,
        adventure_id
      })
    } else if (profile_image) {
      await updateUser({
        fields: [
          {
            field_name: 'profile_picture_url',
            field_value: publicUrl,
            user_id
          }
        ]
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

const deletePicture = async (req, res) => {
  try {
    const { file_name: fileUrl, id_from_token } = req.body

    if (fileUrl.includes('thumbs')) {
      const fileName = fileUrl.split('thumbs/').pop()

      await deleteUserPictures({ file_name: fileUrl })
      deleteImageFromStorage(fileName)
      deleteImageFromStorage(`thumbs/${fileName}`)
    } else if (fileUrl.includes('profile_pictures')) {
      const fileName = fileUrl.split('profile_pictures/').pop()

      await deleteProfilePicture({ user_id: id_from_token })
      deleteImageFromStorage(`profile_pictures/${fileName}`)
    } else {
      throw returnError({
        req,
        res,
        status: NOT_FOUND,
        message: 'The picture you are trying to delete cannot be found'
      })
    }

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
  p
}

module.exports = {
  uploadPictures,
  deletePicture
}
