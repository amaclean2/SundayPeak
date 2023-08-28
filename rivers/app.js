const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { config } = require('dotenv')
const jwt = require('jsonwebtoken')

const router = require('./Routing')
const { corsHandler } = require('./Config/cors')
const { returnError, NOT_ACCEPTABLE } = require('./ResponseHandling')

config()

const app = express()

const validUrls = [
  'GET:/services',
  'GET:favicon',
  'GET:/adventures/all',
  'GET:/adventures/search',
  'GET:/adventures/adventureTypes',
  'GET:/adventures/details',
  'POST:/savePasswordReset',
  'POST:/resetPassword',
  'GET:/verify',
  'POST:/users/login',
  'POST:/users',
  'GET:/users/passwordResetLink',
  'POST:/users/newPassword',
  'GET:/images'
]

app.use(express.static(`${__dirname}/public`))
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

app.use((req, res, next) => {
  return new Promise((resolve, reject) => {
    const bearerToken = req.headers?.authorization?.split(' ').pop()
    const url = req.originalUrl
    const method = req.method.toUpperCase()
    const searchUrl = `${method}:${url}`

    const noAuthRequired = validUrls.some((url) => searchUrl.includes(url))

    if (noAuthRequired) {
      resolve(true)
    }

    if (bearerToken === undefined) {
      reject(
        `there was no authorization token provided for ${searchUrl} from ${req.ip}`
      )
    } else {
      jwt.verify(bearerToken, process.env.JWT_SECRET, {}, (error, decoded) => {
        if (error) reject(error)

        resolve({ idFromToken: decoded.id })
      })
    }
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
