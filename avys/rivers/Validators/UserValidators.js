const { body } = require('express-validator')

const userLoginValidator = () => {
  return [
    body('email')
      .not()
      .isEmpty()
      .withMessage('missingFieldsLogin')
      .isEmail()
      .withMessage('invalidField'),
    body('password').not().isEmpty().withMessage('missingFieldsLogin'),
    body('native').custom((value) => {
      if ([undefined, null].includes(value) || typeof value !== 'boolean')
        throw 'The `native` boolean needs to be present in a token creation request to the server'

      return true
    })
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
      .custom((value) => {
        if (!value) throw 'first_name and last_name fields are required'

        return true
      })
      .customSanitizer((value) => {
        // eslint-disable-next-line
        const excludedRegex = / |[1-9]|[.?!\{\}\(\)\[\]\-+;=*&%$#@#,":']/g
        const newValue = value.replace(excludedRegex, '')
        return newValue
      }),
    body('last_name')
      .custom((value) => {
        if (!value) throw 'first_name and last_name fields are required'

        return true
      })
      .customSanitizer((value) => {
        // eslint-disable-next-line
        const excludedRegex = / |[1-9]|[.?!\{\}\(\)\[\]\-+;=*&%$#@#,":']/g
        const newValue = value.replace(excludedRegex, '')
        return newValue
      }),
    body('legal')
      .custom((value) => {
        if (!value) throw 'missingLegal'

        return true
      })
      .bail()
      .isBoolean()
      .bail()
      .withMessage('legalBool'),
    body('native').custom((value) => {
      if ([undefined, null].includes(value) || typeof value !== 'boolean')
        throw 'The `native` boolean needs to be present in a token creation request to the server'

      return true
    })
  ]
}

const userEditValidator = () => {
  return [
    body('field')
      .custom((field) => {
        if (!field) {
          throw 'the field object must be present in the body with name and value properties'
        }

        const isCorrect = field.name && field.value
        if (!isCorrect) throw 'editFieldsFormat'

        return true
      })
      .customSanitizer((field) => {
        if (['first_name', 'last_name'].includes(field.name)) {
          // eslint-disable-next-line
          const excludedRegex = / |[1-9]|[.?!\{\}\(\)\[\]\-+;=*&%$#@#,":']/g
          const newValue = field.replace(excludedRegex, '')
          return newValue
        }
        return field
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
