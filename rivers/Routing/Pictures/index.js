const { Router } = require('express')
const {
  deletePicture,
  handleSaveImage,
  changeProfilePicture,
  deleteProfilePicture
} = require('../../Handlers/Pictures')

const router = Router()

router.post('/', handleSaveImage)

router.put('/delete', deletePicture)
router.put('/deleteProfilePicture', deleteProfilePicture)
router.put('/changeProfilePicture', changeProfilePicture)

module.exports = router
