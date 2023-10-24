const { body } = require('express-validator')

const ratingRegex = /([0-9]*[.])?[0-9]+:([0-9]*[.])?[0-9]+:([0-9]*[.])?[0-9]+/

const createValidator = () => {
  return [
    body('id_from_token')
      .not()
      .isEmpty()
      .withMessage('notLoggedIn')
      .customSanitizer((value, { req }) => {
        req.body.user_id = value
      }),
    body('adventure_id')
      .not()
      .isEmpty()
      .withMessage('invalidTickActivityFields'),
    body('rating')
      .custom((value) => {
        if (!value) {
          throw 'finishActivityFields'
        }

        const regexMatch = value.match(ratingRegex)
        if (regexMatch === null || regexMatch[0] !== value) {
          throw 'finishActivityFields'
        }

        return true
      })
      .customSanitizer((value, { req }) => {
        const [newRating, oldRating, oldRatingTally] = value.split(':')

        const newAverage =
          oldRatingTally !== '0'
            ? (Number(newRating) + Number(oldRating)) /
              (Number(oldRatingTally) + 1)
            : Number(newRating)

        req.body.old_rating = value
        return `${newAverage}:${Number(oldRatingTally) + 1}`
      }),
    body('difficulty')
      .custom((value) => {
        if (!value) {
          throw 'finishActivityFields'
        }

        const regexMatch = value.match(ratingRegex)
        if (regexMatch === null || regexMatch[0] !== value) {
          throw 'finishActivityFields'
        }

        return true
      })
      .customSanitizer((value, { req }) => {
        const [newRating, oldRating, oldRatingTally] = value.split(':')
        const newAverage =
          oldRatingTally !== '0'
            ? (Number(newRating) + Number(oldRating)) /
              (Number(oldRatingTally) + 1)
            : Number(newRating)

        req.body.old_difficulty = value
        return `${newAverage}:${Number(oldRatingTally) + 1}`
      }),
    body('public')
      .not()
      .isEmpty()
      .withMessage('invalidTickActivityFields')
      .isBoolean()
      .customSanitizer((value) => {
        return value === true ? 1 : 0
      })
  ]
}

module.exports = {
  createValidator
}
