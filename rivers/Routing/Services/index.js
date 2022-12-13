const { Router } = require('express')
const {
  getMapboxAccessToken,
  getFirebaseApiKey
} = require('../../Config/connections')
const { getLoggedInUser } = require('../../Handlers/Users')
const { returnError, sendResponse } = require('../../ResponseHandling')
const { NOT_FOUND, SUCCESS } = require('../../ResponseHandling/statuses')
const { mapboxStyles } = require('../../Services/utils')

const router = Router()

router.get('/mapboxStyles', async (req, res) => {
  try {
    sendResponse({
      req,
      res,
      data: { mapbox_styles: mapboxStyles },
      status: SUCCESS
    })
  } catch (error) {
    throw returnError({ req, res, message: 'unknown server error', error })
  }
})

router.get('/initial', (req, res) => {
  if (req.body.id_from_token) return getLoggedInUser(req, res)
  else {
    return sendResponse({
      req,
      res,
      data: {
        user: false,
        firebase_api_key: getFirebaseApiKey(),
        mapbox_token: getMapboxAccessToken(),
        map_style: mapboxStyles.default
      },
      status: SUCCESS
    })
  }
})

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    data: {
      messasge: 'Please select a method on /services',
      status: NOT_FOUND
    }
  })
})

module.exports = router
