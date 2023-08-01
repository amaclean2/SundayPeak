const { body } = require('express-validator')
const { adventureTypes } = require('../../Config/utils')

const requireAdventureType = body('adventure_type').custom((value) => {
  if (value === undefined)
    throw 'adventure_type property is required to be one of "ski", "climb", "hike", or "bike"'
  if (!adventureTypes.includes(value))
    throw 'adventure_type property is required to be one of "ski", "climb", "hike", or "bike"'

  return true
})

const requireAdventureName = body('adventure_name').custom((value) => {
  if (value === undefined) throw 'adventure_name property is required'
  if (typeof value !== 'string') throw 'adventure_name must be a string'

  return true
})

const requireAdventureCoordinates = body('coordinates').custom(
  (value, { req }) => {
    if (value === undefined)
      throw 'coordinates are required to be of type {lat: float, lng: float}'

    if (value.lat === undefined || value.lng === undefined)
      throw 'coordinates are required to be of type {lat: float, lng: float}'

    req.body.coordinates_lat = value.lat
    req.body.coordinates_lng = value.lng
    delete req.body.coordinates

    return true
  }
)

const requireAdventureNearestCity = body('nearest_city').custom((value) => {
  if (value === undefined) throw 'nearest_city property is required'
  if (typeof value !== 'string') throw 'nearest_city property must be a string'

  return true
})

const requireAdventurePublic = body('public').custom((value) => {
  if (value === undefined) throw 'public property is required'
  if (typeof value !== 'boolean') throw 'public property must be a boolean'

  return true
})

const requireAdventureCreatorId = body('id_from_token')
  .custom((value) => {
    if (value === undefined)
      throw 'a user must be logged in to create an adventure'

    return true
  })
  .customSanitizer((value, { req }) => {
    req.body.creator_id = value
    delete req.body.id_from_token
  })

const formatAdventureRating = body('rating').custom((value) => {
  if (value === undefined) return true
  if (value < 1 || value > 5) throw 'rating must be an integer from 1 - 5'

  return true
})

// the following types only apply if `adventure_type` is "ski"

const requireAdventureDifficulty = body('difficulty').custom(
  (value, { req }) => {
    if (['ski', 'hike'].includes(req.body.adventure_type)) {
      if (value === undefined)
        throw 'difficulty field is required if adventure_type is ski or hike'
      if (value < 1 || value > 5) throw 'difficulty must be a number from 1 - 5'
    }

    return true
  }
)

// the following types only apply if `adventure_type` is "climb"

// the following types only apply if `adventure_type` is "hike"

const adventureCreateValidator = () => {
  return [
    requireAdventureType,
    requireAdventureName,
    requireAdventureCoordinates,
    requireAdventureNearestCity,
    requireAdventurePublic,
    requireAdventureCreatorId,
    formatAdventureRating,
    requireAdventureDifficulty
  ]
}

module.exports = {
  adventureCreateValidator
}
