const { check } = require('express-validator')

const picturesDeleteValidator = () => {
  return [check('file_name').not().isEmpty().withMessage('deletePicturesError')]
}

module.exports = {
  picturesDeleteValidator
}
