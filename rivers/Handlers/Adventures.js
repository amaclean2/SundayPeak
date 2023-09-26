const { validationResult } = require('express-validator')
const logger = require('../Config/logger')

const serviceHandler = require('../Config/services')
const { returnError, sendResponse } = require('../ResponseHandling')
const { SUCCESS, NO_CONTENT, CREATED } = require('../ResponseHandling/statuses')

const createNewAdventure = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    console.log({ adventureObject: req.body })

    const { adventure, adventureList } =
      await serviceHandler.adventureService.createAdventure({
        adventureObject: req.body
      })

    return sendResponse({
      req,
      res,
      data: { adventure, all_adventures: adventureList },
      status: CREATED
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverCreateAdventure', error })
  }
}

const importBulkData = async (req, res) => {
  try {
    const { adventures, id_from_token } = req.body

    if (!adventures)
      throw 'an object with the key "adventures" needs to be provided'

    const sanitizedAdventures = adventures.map((adventure) => ({
      ...adventure,
      coordinates_lat: adventure.coordinates.lat,
      coordinates_lng: adventure.coordinates.lng,
      creator_id: id_from_token
    }))

    await serviceHandler.adventureService.bulkAdventureCreation({
      adventures: sanitizedAdventures
    })

    return sendResponse({
      req,
      res,
      data: { message: 'data imported successfully' },
      status: CREATED
    })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'The import of your data failed. Hope something here can help',
      error
    })
  }
}

const getAllAdventures = async (req, res) => {
  try {
    // handle the response from the validation middleware
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    // get the parameters from the request body
    const { type } = req.query

    if (!type) {
      throw 'type query parameter required'
    }

    const adventures = await serviceHandler.adventureService.getAdventureList({
      adventureType: type
    })

    return sendResponse({ req, res, data: { adventures }, status: SUCCESS })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetAdventures' })
  }
}

const searchAdventures = async (req, res) => {
  try {
    const { search } = req.query

    if (!search) {
      throw 'The search query parameter is required to search for an adventure'
    }

    const adventures =
      await serviceHandler.adventureService.searchForAdventures({ search })

    return sendResponse({
      req,
      res,
      data: { adventures, search },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, error, message: 'serverGetAdventures' })
  }
}

const getAdventureDetails = async (req, res) => {
  try {
    const { id, type } = req.query
    if (!id) {
      throw returnError({ req, res, message: 'adventureIdFieldRequired' })
    }

    logger.info({ id, type })

    const adventure =
      await serviceHandler.adventureService.getSpecificAdventure({
        adventureId: id,
        adventureType: type
      })

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

const editAdventure = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw returnError({ req, res, error: errors.array()[0] })
    }

    await serviceHandler.adventureService.editAdventure(req.body)

    return sendResponse({ req, res, data: {}, status: NO_CONTENT })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'Server Error: Could not edit the adventure',
      error
    })
  }
}

const processCSV = async (req, res) => {
  try {
    const { csvString } = req.body
    const jsonAdventureObject =
      await serviceHandler.adventureService.processCSVToAdventure({ csvString })

    return sendResponse({
      req,
      res,
      data: { adventures: jsonAdventureObject },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'could not process this data',
      error
    })
  }
}

const deleteAdventure = async (req, res) => {
  try {
    const { adventure_id, adventure_type } = req.query

    await serviceHandler.adventureService.deleteAdventure({
      adventureId: Number(adventure_id),
      adventureType: adventure_type
    })

    return sendResponse({ req, res, data: {}, status: NO_CONTENT })
  } catch (error) {
    return returnError({ req, res, message: 'serverDeleteAdventure', error })
  }
}

module.exports = {
  getAllAdventures,
  searchAdventures,
  processCSV,
  getAdventureDetails,
  importBulkData,
  createNewAdventure,
  editAdventure,
  deleteAdventure
}
