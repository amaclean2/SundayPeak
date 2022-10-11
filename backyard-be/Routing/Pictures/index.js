const { Router } = require('express')
const { uploadPictures, deletePicture } = require('../../Handlers/Pictures')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')

const router = Router()

router.post('/userUpload', uploadPictures)
router.post('/adventureUpload', uploadPictures)
router.post('/delete', deletePicture)

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    data: {
      message: 'Please select a method on /pictures',
      status: NOT_FOUND
    }
  })
})

module.exports = router
