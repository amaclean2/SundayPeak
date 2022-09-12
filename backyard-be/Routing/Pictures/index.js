const { Router } = require('express');
const { NOT_FOUND } = require('../../ResponseHandling/statuses');
const {
    deletePictures,
    uploadAdventurePictures,
    uploadPictures
} = require('../../Handlers/Pictures');

const router = Router();

router.post('/upload', uploadPictures);
router.post('/adventureUpload', uploadAdventurePictures);
router.post('/delete', deletePictures);

router.use('/', (req, res) => {
    res.status(NOT_FOUND).json({
        data: {
            message: 'Please select a method on /pictures',
            status: NOT_FOUND
        }
    })
})

module.exports = router;