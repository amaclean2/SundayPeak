const { Router } = require('express')
const { getAppStats } = require('../../Handlers/General')
const { sendResponse } = require('../../ResponseHandling')
const { NOT_FOUND, SUCCESS } = require('../../ResponseHandling/statuses')

const router = Router()

router.get('/verify', getAppStats)
router.get('/initial', (req, res) => {
  return sendResponse({
    req,
    res,
    data: {
      mapbox_token: process.env.MAPBOX_ACCESS_TOKEN,
      map_style: 'mapbox://styles/mapbox/outdoors-v12'
    },
    status: SUCCESS
  })
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
