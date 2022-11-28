const { validationResult } = require('express-validator')

const logger = require('../Config/logger')
const { updateAdventure } = require('../DB')
const queries = require('../DB')
const { returnError, sendResponse } = require('../ResponseHandling')
const { SUCCESS, NO_CONTENT, CREATED } = require('../ResponseHandling/statuses')
const {
  buildAdventureObject,
  parseCoordinates
} = require('../Services/adventure.service')
const { adventureTypes } = require('../Services/utils')

const getAllAdventures = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { bounding_box, type } = req.body
    const parsedCoordinates = parseCoordinates({ boundingBox: bounding_box })
    const adventures = await queries.getAdventures(parsedCoordinates, type, 10)

    return sendResponse({ req, res, data: { adventures }, status: SUCCESS })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetAdventures' })
  }
}

const getAdventureDetails = async (req, res) => {
  try {
    const { id, type } = req.query

    if (!(id && type)) {
      throw returnError({ req, res, message: 'adventureIdFieldRequired' })
    }

    if (!adventureTypes.includes(type)) {
      throw returnError({
        req,
        res,
        message: 'adventure type is not one that is supported'
      })
    }

    const adventure = await buildAdventureObject({ id, type })
    return sendResponse({ req, res, data: { adventure }, status: SUCCESS })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'serverGetAdventureDetails',
      error
    })
  }
}

const createNewAdventure = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const resultId = await queries.addAdventure(req.body)
    const responseBody = req.body

    responseBody.id = resultId
    responseBody.coordinates = {
      lat: responseBody.coordinates_lat,
      lng: responseBody.coordinates_lng
    }

    delete responseBody.coordinates_lat
    delete responseBody.coordinates_lng

    return sendResponse({
      req,
      res,
      data: { adventure: responseBody },
      status: CREATED
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverCreateAdventure', error })
  }
}

const editAdventure = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    const { fields, adventure_id } = req.body

    const formattedFields = fields.map((field) => ({
      field_name: field.name,
      field_value: field.value,
      adventure_id
    }))

    const updates = await updateAdventure({ fields: formattedFields })
    updates.forEach(logger.debug)

    return sendResponse({ req, res, data: {}, status: NO_CONTENT })
  } catch (error) {
    return returnError({ req, res, message: 'serverValidationError', error })
  }
}

const deleteAdventure = async (req, res) => {
  try {
    const { adventure_id } = req.query
    const deletion_resp = await queries.deleteAdventure(adventure_id)
    logger.debug('ADVENTURE_DELETED', deletion_resp)

    return sendResponse({ req, res, data: {}, status: NO_CONTENT })
  } catch (error) {
    return returnError({ req, res, message: 'serverDeleteAdventure', error })
  }
}

module.exports = {
  buildAdventureObject,
  parseCoordinates,
  getAllAdventures,
  getAdventureDetails,
  createNewAdventure,
  editAdventure,
  deleteAdventure
}
