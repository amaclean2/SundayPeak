const { body } = require('express-validator')
const logger = require('../Config/logger')

const adventureCreateValidator = () => {
  return [
    body('adventure_type').not().isEmpty().withMessage('adventureType'),
    body('adventure_name').not().isEmpty().withMessage('adventureName'),
    body('coordinates')
      .not()
      .isEmpty()
      .withMessage('coordinates')
      .customSanitizer((value, { req }) => {
        const parsedCoordinates = JSON.parse(value)

        req.body.coordinates_lat = parsedCoordinates.lat
        req.body.coordinates_lng = parsedCoordinates.lng
        delete req.body.coordinates
      }),
    body('id_from_token')
      .not()
      .isEmpty()
      .withMessage('creatorId')
      .customSanitizer((value, { req }) => {
        req.body.creator_id = value
        delete req.body.id_from_token
      })
  ]
}

const adventureEditValidator = () => {
  return [
    body('fields').custom((fields) => {
      logger.info({ fields })
      const isCorrect = fields.every((field) => {
        return field.name && field.value
      })

      if (!isCorrect) throw 'editFieldsFormat'

      return true
    }),
    body('adventure_id').custom((adventureId) => {
      if (!adventureId) throw 'editAdventureIdMissing'

      return true
    })
  ]
}

const adventuresGetValidator = () => {
  return [
    body('bounding_box')
      .custom((value) => typeof value === 'object')
      .withMessage('boundingBoxType')
      .custom((value) => 'NE' in value)
      .withMessage('boundingBox')
      .custom((value) => 'SW' in value)
      .withMessage('boundingBox')
  ]
}

module.exports = {
  adventureCreateValidator,
  adventuresGetValidator,
  adventureEditValidator
}
