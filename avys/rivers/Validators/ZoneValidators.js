const { body } = require('express-validator')
const {
  requireAdventureType,
  requireAdventureCoordinates,
  requireAdventurePublic,
  requireAdventureNearestCity
} = require('./AdventureValidators/AdventureCreateValidator')

const requireZoneName = body('zone_name').custom((value) => {
  if (!value) throw 'zone_name field is required'

  if (typeof value !== 'string') throw 'zone_name field must be a string'

  return true
})

const zoneCreateValidator = () => {
  return [
    requireAdventureType,
    requireZoneName,
    requireAdventureCoordinates,
    requireAdventurePublic,
    requireAdventureNearestCity
  ]
}

const zoneEditValidator = () => {
  return [
    body('field').customSanitizer((value) => {
      if (!value) throw 'field object required in body'

      if (!value?.field_name || typeof value?.field_name !== 'string') {
        throw 'string field_name required on field object'
      }

      const editableFieldValues = [
        'zone_name',
        'bio',
        'approach',
        'coordinates',
        'nearest_city',
        'public'
      ]

      if (!editableFieldValues.includes(value.field_name)) {
        throw `editable zone fields are only ${editableFieldValues.join(', ')}.`
      }

      if (!value.field_value) {
        throw 'field_value required on field object'
      }

      if (value.field_name === 'coordinates') {
        if (!value.field_value.lat || !value.field_value.lng) {
          throw 'coordinates must be an object containing lat and lng properties'
        }
      }

      if (!value.zone_id) {
        throw 'zone_id required on field object'
      }

      value = {
        editField: value.field_name,
        editValue: value.field_value,
        editZoneId: value.zone_id
      }

      return value
    })
  ]
}

module.exports = {
  zoneCreateValidator,
  zoneEditValidator
}
