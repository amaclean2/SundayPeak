const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { config } = require('dotenv')
const jwt = require('jsonwebtoken')

const router = require('./Routing')
const { corsHandler } = require('./Config/cors')
const { returnError, NOT_ACCEPTABLE } = require('./ResponseHandling')
const { isPublicRoute } = require('./Validators/ValidUrls')
const logger = require('./Config/logger')

config()

const app = express()

app.use(express.static('/home/app/public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// security middleware
app.use(cors({ origin: corsHandler }))
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false
  })
)

app.use(async (req, res, next) => {
  try {
    const bearerToken = req.headers?.authorization?.split(' ').pop()
    const method = req.method.toUpperCase()
    const searchUrl = `${method}:${req.path}`

    if (req.body) {
      delete req.body.id_from_token
    }

    const noAuthRequired = isPublicRoute(method, req.path)

    let validation

    if (noAuthRequired) {
      validation = 'skipped'
    } else if (bearerToken === undefined) {
      throw `there was no authorization token provided for ${searchUrl} from ${req.ip}`
    } else {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET)
      validation = { idFromToken: decoded.id }
    }

    if (validation === 'skipped') {
      req.logger = logger.child({ meta: { userId: null } })
      next()
    } else if (validation.idFromToken) {
      // add a logger with a userId token
      req.logger = logger.child({
        meta: {
          userId: validation.idFromToken
        }
      })

      if (req.body) {
        req.body.id_from_token = validation.idFromToken
      } else {
        req.body = { id_from_token: validation.idFromToken }
      }
      next()
    } else {
      throw `token ${bearerToken} could not be verified`
    }
  } catch (error) {
    logger.error(error)
    return returnError({ req, res, status: NOT_ACCEPTABLE, error })
  }
}, router)

module.exports = app
