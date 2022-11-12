const { body } = require('express-validator')
const logger = require('../Config/logger')
const { checkPasswordResetToken } = require('../DB')

const queries = require('../DB')

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
  return [
    body('email').custom(async (value) => {
      const userExists = await queries.checkForUser({ email: value })
      if (!userExists) throw 'noAccountExists'
      return true
    })
  ]
}

const newPasswordValidator = () => {
  return [
    body('password').custom((_, { req }) => {
      const paramsExist = req?.body?.password && req?.body?.reset_token

      if (!paramsExist) throw 'invalidPasswordResetBody'
      return true
    }),
    body('reset_token').custom(async (value, { req }) => {
      const { id } = await checkPasswordResetToken({ token: value })

      if (!id) {
        throw 'noAccountExists'
      }

      req.body.user_id = id
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
      .custom(async (value) => {
        const idExists = await queries.checkForUser({ email: value })

        if (idExists) throw 'preexistingUser'
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
      .isLength({ min: 5, max: 30 })
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
    body('fields')
      .custom((fields) => {
        logger.info({ fields })
        const isCorrect = fields.every((field) => {
          return field.name && field.value
        })

        if (!isCorrect) throw 'editFieldsFormat'

        return true
      })
      .custom((fields) => {
        for (const field in fields) {
          if (
            field.field_name === 'sex' &&
            typeof field.field_value !== 'number'
          ) {
            throw 'editFieldsFormat'
          }
        }

        return true
      })
  ]
}

const userFollowValidator = () => {
  return [
    body('leader_id')
      .not()
      .isEmpty()
      .bail()
      .withMessage('leaderRequired')
      .custom(async (value, { req }) => {
        const alreadyFollowed = await queries.getRelationship({
          leader_id: value,
          follower_id: req.body.id_from_token
        })

        if (alreadyFollowed.length) throw 'alreadyFollowed'

        return true
      })
  ]
}

module.exports = {
  userLoginValidator,
  userCreateValidator,
  userFollowValidator,
  userEditValidator,
  passwordResetValidator,
  newPasswordValidator
}
