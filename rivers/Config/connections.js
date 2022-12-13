const { config } = require('dotenv')
const logger = require('./logger')

config()

const getDBConnectionObject = () => {
  logger.info(`NODE_ENV, ${process.env.NODE_ENV}`)

  switch (process.env.NODE_ENV) {
    case 'dev':
      return {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      }

    case 'prod':
    case 'stage':
      return {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        socketPath: `/cloudsql/${process.env.SQL_CONNECTION_NAME}`,
        database: process.env.DB_NAME
      }
    case 'test':
      return {
        host: 'localhost',
        user: 'byf',
        password: 'backyard',
        database: 'test_friends',
        port: 3306
      }
    default:
      return {
        host: 'localhost',
        user: 'root',
        password: 'backyard',
        database: 'friends',
        port: 3306
      }
  }
}

const getJWTSecret = () => {
  switch (process.env.NODE_ENV) {
    case 'stage':
      return process.env.JWT_SECRET
    default:
      return 'secret'
  }
}

const getMapboxAccessToken = () => process.env.MAPBOX_ACCESS_TOKEN
const getFirebaseApiKey = () => process.env.FIREBASE_API_KEY

module.exports = {
  getDBConnectionObject,
  getJWTSecret,
  getMapboxAccessToken,
  getFirebaseApiKey
}
