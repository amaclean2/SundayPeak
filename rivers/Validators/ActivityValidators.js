const { body } = require('express-validator')

const createValidator = () => {
  return [
    body('id_from_token')
      .not()
      .isEmpty()
      .withMessage('notLoggedIn')
      .customSanitizer((value, { req }) => {
        req.body.user_id = value
      }),
    body('adventure_id').not().isEmpty(),
    body('public')
      .isBoolean()
      .customSanitizer((value) => {
        return value === true ? 1 : 0
      })
  ]
}

module.exports = {
  createValidator
}
