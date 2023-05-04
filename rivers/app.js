const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { config } = require('dotenv')

const router = require('./Routing')
const { corsHandler } = require('./Config/cors')
const serviceHandler = require('./Config/services')
const { returnError, NOT_ACCEPTABLE } = require('./ResponseHandling')

config()

const app = express()

app.use(express.static(`${__dirname}/public/images`))
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

// public routes
app.use((req, res, next) => {
  const bearerToken = req.headers?.authorization?.split(' ').pop()
  return serviceHandler.validationService
    .validate({
      originalUrl: req.originalUrl,
      token: bearerToken?.replace(/"/g, '')
    })
    .then((validationResponse) => {
      if (validationResponse === true) {
        next()
      } else {
        if (req.body) {
          req.body.id_from_token = validationResponse.idFromToken
        } else {
          req.body = { id_from_token: validationResponse.idFromToken }
        }

        next()
      }
    })
    .catch((error) => {
      return returnError({ req, res, status: NOT_ACCEPTABLE, message: error })
    })
}, router)

module.exports = app
