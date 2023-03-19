const { body } = require('express-validator')

const userLoginValidator = () => {
  return [
    body('email')
      .not()
      .isEmpty()
      .withMessage('missingFieldsLogin')
      .isEmail()
      .withMessage('invalidField'),
    body('password').not().isEmpty().withMessage('missingFieldsLogin')
  ]
}

const passwordResetValidator = () => {
  return []
}

const newPasswordValidator = () => {
  return [
    body('password').custom((_, { req }) => {
      const paramsExist = req?.body?.password && req?.body?.reset_token

      if (!paramsExist) throw 'invalidPasswordResetBody'
      return true
    })
  ]
}

const userCreateValidator = () => {
  return [
    body('email')
      .custom((value) => {
        if (!value) throw 'missingFieldsCreateUser'
        return true
      })
      .bail()
      .isEmail()
      .bail()
      .withMessage('invalidField'),
    body('password')
      .not()
      .isEmpty()
      .bail()
      .withMessage('missingFieldsCreateUser')
      .isLength({ min: 5, max: 50 })
      .bail()
      .withMessage('passwordOutOfRange'),
    body('password_2')
      .not()
      .isEmpty()
      .bail()
      .withMessage('missingFieldsCreateUser')
      .custom((value, { req }) => {
        if (value !== req.body.password) throw 'nonMatchingPasswords'

        return true
      })
      .bail(),
    body('first_name')
      .optional()
      .isAlpha()
      .bail()
      .withMessage('flNameAlpha')
      .not()
      .isEmpty()
      .bail()
      .trim(),
    body('last_name')
      .optional()
      .isAlpha()
      .bail()
      .withMessage('flNameAlpha')
      .not()
      .isEmpty()
      .bail()
      .trim()
      .bail(),
    body('legal')
      .custom((value) => {
        if (!value) throw 'missingLegal'

        return true
      })
      .bail()
      .isBoolean()
      .bail()
      .withMessage('legalBool')
  ]
}

const userEditValidator = () => {
  return [
    body('field').custom((field) => {
      if (!field) {
        throw 'the field object must be present in the body with name and value properties'
      }

      const isCorrect = field.name && field.value
      if (!isCorrect) throw 'editFieldsFormat'

      return true
    })
  ]
}

module.exports = {
  userLoginValidator,
  userCreateValidator,
  userEditValidator,
  passwordResetValidator,
  newPasswordValidator
}
