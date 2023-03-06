const logger = require('./logger')

/**
 *
 * @param {Object} connectionObject
 * @param {string} connectionObject.host
 * @param {string} connectionObject.user
 * @param {string} connectionObject.password
 * @param {string} connectionObject.database
 * @param {number} connectionObject.port
 * @returns {Object} a connection object
 */
const getDBConnectionObject = (connectionObject) => {
  logger.info(connectionObject)

  return connectionObject
}

const getMapboxAccessToken = () => process.env.MAPBOX_ACCESS_TOKEN

const isLocal = ['dev', 'text'].includes(process.env.NODE_ENV)

module.exports = {
  getDBConnectionObject,
  getMapboxAccessToken,
  isLocal
}
