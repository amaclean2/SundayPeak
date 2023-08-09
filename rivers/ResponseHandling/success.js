const logger = require('../Config/logger')

const sendResponse = ({ req, res, data, status }) => {
  logger.info(`RESPONSE: ${req.method}:${req.originalUrl}`)
  logger.info(`STATUS: ${status}`)

  return res.status(status).json({
    data,
    statusCode: status
  })
}

module.exports = {
  sendResponse
}
