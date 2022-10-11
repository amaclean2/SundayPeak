const { body } = require('express-validator')
const logger = require('../Config/logger')

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

const userCreateValidator = () => {
  return [
    body('email')
      .custom((value) => {
        if (!value) throw 'missingFieldsCreateUser'
        return true
      })
      .bail()
      .custom(async (value) => {
        const idExists = await queries.checkForUser(value)

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
        const alreadyFollowed = await queries.getFollowedRelationship({
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
  userEditValidator
}
