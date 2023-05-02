const { Router } = require('express')
const {
  deletePicture,
  handleSaveImage,
  changeProfilePicture,
  deleteProfilePicture
} = require('../../Handlers/Pictures')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')

const router = Router()

router.post('/upload', handleSaveImage)
router.delete('/delete', deletePicture)

router.put('/deleteProfilePicture', deleteProfilePicture)
router.put('/changeProfilePicture', changeProfilePicture)

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    data: {
      message: 'Please select a method on /pictures',
      status: NOT_FOUND
    }
  })
})

module.exports = router
