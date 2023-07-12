const { body } = require('express-validator')
const { isDefined } = require('./utils')

const adventureCreateValidator = () => {
  return [
    body('adventure_type')
      .not()
      .isEmpty()
      .withMessage('missingAdventureProperty'),
    body('adventure_name')
      .not()
      .isEmpty()
      .withMessage('missingAdventureProperty'),
    body('coordinates')
      .not()
      .isEmpty()
      .withMessage('missingAdventureProperty')
      .custom((value, { req }) => {
        if (!value) throw 'missingAdventureProperty'

        const parsedCoordinates =
          typeof value === 'string' ? JSON.parse(value) : value

        req.body.coordinates_lat = parsedCoordinates.lat
        req.body.coordinates_lng = parsedCoordinates.lng
        delete req.body.coordinates

        return true
      }),
    body('nearest_city')
      .not()
      .isEmpty()
      .withMessage('missingAdventureProperty'),
    body('public').not().isEmpty().withMessage('missingAdventureProperty'),
    body('id_from_token')
      .not()
      .isEmpty()
      .withMessage('missingAdventureProperty')
      .customSanitizer((value, { req }) => {
        req.body.creator_id = value
        delete req.body.id_from_token
      })
  ]
}

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
  adventureCreateValidator,
  adventuresGetValidator,
  adventureEditValidator,
  adventureBulkInsertValidator
}
