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
  return connectionObject
}

const isLocal = ['development', 'test'].includes(process.env.NODE_ENV)

module.exports = {
  getDBConnectionObject,
  isLocal
}
