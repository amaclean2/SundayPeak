const { body } = require('express-validator')

const adventureTypes = ['ski', 'climb', 'hike', 'bike', 'skiApproach']

const requireAdventureType = body('adventure_type').custom((value) => {
  if (value === undefined)
    throw 'adventure_type property is required to be one of "ski", "climb", "hike", "bike", or "skiApproach"'
  if (!adventureTypes.includes(value))
    throw 'adventure_type property is required to be one of "ski", "climb", "hike", "bike", or "skiApproach"'

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

const sanitizeAdventureDifficulty = body('difficulty').customSanitizer(
  (value) => {
    if (value !== undefined) {
      value = `${value}:1`
    } else {
      value = '0:0'
    }

    return value
  }
)

const sanitizeAdventureRating = body('rating').customSanitizer((value) => {
  if (value !== undefined) {
    value = `${value}:1`
  } else {
    value = '0:0'
  }

  return value
})

const formatAdventureTrailPath = body('path')
  .custom((value, { req }) => {
    if (
      ['ski', 'hike', 'bike', 'skiApproach'].includes(req.body.adventure_type)
    ) {
      if (value === undefined) return true
      else if (typeof value === 'object') return true
      else {
        throw 'path must be an object containing an array of data points'
      }
    }
    return true
  })
  .customSanitizer((value, { req }) => {
    if (value !== undefined) {
      req.body.trail_path = JSON.stringify(value)
      delete req.body.path
    }

    return value
  })

const formatAdventureDistance = body('distance').custom((value, { req }) => {
  if (['skiApproach', 'hike', 'bike'].includes(req.body.adventure_type)) {
    if (value === undefined) return true
    if (typeof value === 'number') {
      return true
    } else {
      throw 'distance value must be a number'
    }
  }

  return true
})

const adventureCreateValidator = () => {
  return [
    requireAdventureType,
    requireAdventureName,
    requireAdventureCoordinates,
    requireAdventureNearestCity,
    requireAdventurePublic,
    requireAdventureCreatorId,
    formatAdventureRating,
    formatAdventureTrailPath,
    sanitizeAdventureDifficulty,
    sanitizeAdventureRating,
    formatAdventureDistance
  ]
}

module.exports = {
  adventureCreateValidator,
  adventureTypes,
  requireAdventureType,
  requireAdventureCoordinates,
  requireAdventurePublic,
  requireAdventureNearestCity
}
