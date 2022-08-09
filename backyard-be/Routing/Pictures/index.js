import { Router } from 'express';

import { NOT_FOUND } from '../../ErrorHandling/statuses';
import {
    deletePictures,
    uploadAdventurePictures,
    uploadPictures
} from '../../Handlers/Pictures';

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

export default router;