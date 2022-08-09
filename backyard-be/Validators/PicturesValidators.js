import { body } from 'express-validator'

export const picturesDeleteValidator = () => {
    return [
        check('file_name')
            .not().isEmpty()
            .withMessage('deletePicturesError')
    ];
};