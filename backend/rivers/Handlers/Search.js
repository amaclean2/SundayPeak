const {
  returnError,
  SERVER_ERROR,
  NOT_ACCEPTABLE,
  sendResponse,
  SUCCESS
} = require('../ResponseHandling')
const serviceHandler = require('../Config/services')
const logger = require('../Config/logger')

const handleUserSearch = async (req, res) => {
  try {
    const searchText = req.query?.q
    const userId = req.query?.id
    const amongFriends = req.query?.friends

    if (!searchText) {
      throw returnError({
        req,
        res,
        status: NOT_ACCEPTABLE,
        message: '`q` parameter must be present in a search query'
      })
    }

    if (!userId) {
      throw returnError({
        req,
        res,
        status: NOT_ACCEPTABLE,
        message: '`id` parameter must be present in a search query'
      })
    }

    logger.info(`Searching for: ${searchText}`)

    const results = await serviceHandler.searchService.userSearch({
      searchText,
      userId,
      amongFriends
    })
    return sendResponse({
      req,
      res,
      data: { searchResults: results },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, status: SERVER_ERROR, error })
  }
}

const handleAdventureSearch = async (req, res) => {
  try {
    const searchText = req.query?.q
    const parentId = req.query?.id

    if (!searchText) {
      throw returnError({
        req,
        res,
        status: NOT_ACCEPTABLE,
        message: '`q` parameter must be present in a search query'
      })
    }

    const results = await serviceHandler.searchService.adventureSearch({
      searchText,
      parentId
    })

    return sendResponse({
      req,
      res,
      data: { searchResults: results },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, status: SERVER_ERROR, error })
  }
}

const handleZoneSearch = async (req, res) => {
  try {
    const searchText = req.query?.q
    const parentId = req.query?.id

    if (!searchText) {
      throw returnError({
        req,
        res,
        status: NOT_ACCEPTABLE,
        message: '`q` parameter must be present in a search query'
      })
    }

    const results = await serviceHandler.searchService.zoneSearch({
      searchText,
      parentId
    })

    return sendResponse({
      req,
      res,
      data: { searchResults: results },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({ req, res, status: SERVER_ERROR, error })
  }
}

module.exports = {
  handleUserSearch,
  handleAdventureSearch,
  handleZoneSearch
}
