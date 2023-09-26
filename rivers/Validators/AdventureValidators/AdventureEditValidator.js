const { body } = require('express-validator')
const { isDefined, checkPathObj, convertPathObject } = require('../utils')

const adventureEditValidator = () => {
  return [
    body('field')
      .custom((field, { req }) => {
        if (field === undefined) {
          throw 'field object containing name, value, adventure_id, and adventure_type must be present in the body'
        }

        const isCorrect = isDefined(
          field.name,
          field.value,
          field.adventure_id,
          field.adventure_type
        )

        if (
          [
            'distance',
            'exposure',
            'summit_elevation',
            'base_elevation'
          ].includes(field.name) &&
          typeof field.value !== 'number'
        ) {
          req.body.field.value = parseInt(field.value)
        }

        // ensure the path object is an array of lat/lng arrays
        if (field.name === 'path') {
          checkPathObj(field.value)
        }

        // block a change if people have already been completing the activity
        if (field.name === 'difficulty') {
          const [difficultyValue, iterations] = field.value.split(':')
          if (iterations > 1) {
            throw 'difficulty cannot be edited once users have been completing the activity'
          }
        }

        // block users from editing a rating
        if (field.name === 'rating') {
          throw 'rating cannot be edited'
        }

        if (!isCorrect) throw 'editFieldFormat'

        return true
      })
      .customSanitizer((field, { req }) => {
        if (field.name === 'path') {
          const trailPath = convertPathObject(field.value)

          req.body.field.name = 'trail_path'
          req.body.field.value = trailPath
        }
        if (field.name === 'distance') {
          if (req.body.adventure_type === 'ski') {
            req.body.field.name = 'approach_distance'
            req.body.field.value = field.value.toString()
          }
        }

        return field
      })
  ]
}

module.exports = { adventureEditValidator }
