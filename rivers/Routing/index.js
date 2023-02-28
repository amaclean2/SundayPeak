const { Router } = require('express')

const usersRouter = require('./Users')
const adventuresRouter = require('./Adventures')
const activitiesRouter = require('./Activities')
const ticksRouter = require('./Ticks')
const picturesRouter = require('./Pictures')
const servicesRouter = require('./Services')
const { requestLogger } = require('../Config/loggerMiddleware')

const router = Router()

router.use(requestLogger)

router.use('/users', usersRouter)
router.use('/adventures', adventuresRouter)
router.use('/activities', activitiesRouter)
router.use('/ticks', ticksRouter)
router.use('/pictures', picturesRouter)
router.use('/services', servicesRouter)

module.exports = router
