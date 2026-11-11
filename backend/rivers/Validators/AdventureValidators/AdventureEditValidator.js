const { body } = require('express-validator')
const { isDefined, numFields } = require('../utils')
const logger = require('@amaclean2/sundaypeak-water/Config/logger')

const adventureEditValidator = () => {
  return [
    body('field')
      .custom((field, { req }) => {
        if (field === undefined && !req.body.fields) {
          throw 'field object containing name, value, adventure_id, and adventure_type must be present in the body'
        } else if (field === undefined) {
          return true
        }

        const isCorrect = isDefined(
          field.name,
          field.value,
          field.adventure_id,
          field.adventure_type
        )

        // block a change if people have already been completing the activity
        if (field.name === 'difficulty') {
          const [difficultyValue, iterations] = field.value.split(':')
          if (Number(iterations) > 1) {
            throw 'difficulty cannot be edited once users have been completing the activity'
          }
          if (isNaN(Number(difficultyValue))) {
            throw 'the first value in difficulty needs to be a number formatted as a string'
          }
        }

        // block users from editing a rating
        if (field.name === 'rating') {
          throw 'rating cannot be edited'
        }

        if (field.name === 'coordinates') {
          if (!Array.isArray(field.value) || field.value.length !== 2) {
            throw 'coordinates field must be an array of lng, lat values'
          }
        }

        if (field.name === 'public') {
          if (typeof field.value !== 'boolean') {
            throw 'public should be a boolean true/false'
          }
        }

        if (!isCorrect)
          throw 'field object containing name, value, adventure_id, and adventure_type must be present in the body'

        return true
      })
      .customSanitizer((field, { req }) => {
        if (!field) {
          return field
        }

        if (
          [
            'distance',
            'exposure',
            'summit_elevation',
            'base_elevation'
          ].includes(field.name) &&
          typeof field.value !== 'number'
        ) {
          field.value = parseFloat(field.value)
        }

        if (field.name === 'coordinates') {
          logger.info('coordinates parsing')
          req.body.fields = [
            {
              name: 'coordinates_lng',
              value: field.value[0],
              adventure_id: field.adventure_id,
              adventure_type: field.adventure_type
            },
            {
              name: 'coordinates_lat',
              value: field.value[1],
              adventure_id: field.adventure_id,
              adventure_type: field.adventure_type
            }
          ]
        }

        if (numFields.includes(field.name) && !field.value) {
          field.value = 0
        } else if (numFields.includes(field.name)) {
          field.value = parseFloat(field.value)
        }

        return field
      }),
    body('fields')
      .custom((fields) => {
        if (!fields) {
          return true
        }

        fields.forEach((field) => {
          const isCorrect = isDefined(
            field.name,
            field.value,
            field.adventure_id,
            field.adventure_type
          )

          // block a change if people have already been completing the activity
          if (field.name === 'difficulty') {
            const [difficultyValue, iterations] = field.value.split(':')
            if (Number(iterations) > 1) {
              throw 'difficulty cannot be edited once users have been completing the activity'
            }
            if (isNaN(Number(difficultyValue))) {
              throw 'the first value in difficulty needs to be a number formatted as a string'
            }
          }

          // block users from editing a rating
          if (field.name === 'rating') {
            throw 'rating cannot be edited'
          }

          if (field.name === 'public') {
            if (typeof field.value !== 'boolean') {
              throw 'public should be a boolean true/false'
            }
          }

          if (!isCorrect)
            throw 'an array of field objects containing name, value, adventure_id, and adventure_type must be present in the body'
        })
        return true
      })
      .customSanitizer((fields) => {
        if (!fields) return fields

        return fields.map((field) => {
          const newField = { ...field }

          if (numFields.includes(field.name)) {
            newField.value = parseFloat(field.value)
          }

          return newField
        })
      })
  ]
}

module.exports = { adventureEditValidator }
