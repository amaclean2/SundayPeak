const { body } = require('express-validator')
const { isDefined } = require('../utils')
const { adventureCreateValidator } = require('./AdventureCreateValidator')

const adventureEditValidator = () => {
  return [
    body('field').custom((field, { req }) => {
      if (!field) {
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
          'difficulty',
          'exposure',
          'summit_elevation',
          'base_elevation'
        ].includes(field.name) &&
        typeof field.value !== 'number'
      ) {
        req.body.field.value = parseInt(field.value)
      }

      if (!isCorrect) throw 'editFieldsFormat'

      return true
    })
  ]
}

const adventuresGetValidator = () => {
  return []
}

const adventureBulkInsertValidator = () => {
  return [
    body('adventures').custom((field) => {
      if (!field) {
        throw '"adventure" parameter required in body'
      }
    })
  ]
}

module.exports = {
  adventuresGetValidator,
  adventureEditValidator,
  adventureBulkInsertValidator,
  adventureCreateValidator
}
