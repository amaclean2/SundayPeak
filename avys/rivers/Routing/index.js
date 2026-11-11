const { Router } = require('express')

const usersRouter = require('./Users')
const adventuresRouter = require('./Adventures')
const picturesRouter = require('./Pictures')
const servicesRouter = require('./Services')
const conversationsRouter = require('./Messages')
const searchRouter = require('./Services/Search')
const zonesRouter = require('./Adventures/Zones')
const { requestLogger } = require('../Config/loggerMiddleware')
const { sendResponse, NOT_FOUND } = require('../ResponseHandling')

const router = Router()

router.use(requestLogger)

router.use('/users', usersRouter)
router.use('/adventures', adventuresRouter)
router.use('/pictures', picturesRouter)
router.use('/services', servicesRouter)
router.use('/conversations', conversationsRouter)
router.use('/zones', zonesRouter)
router.use('/search', searchRouter)

router.use('/', (req, res) => {
  return sendResponse({
    req,
    res,
    data: {
      message: 'Select a path to create an API connection',
      paths: [
        '/users',
        '/adventures',
        '/pictures',
        '/services',
        '/conversations'
      ]
    },
    status: NOT_FOUND
  })
})

module.exports = router
