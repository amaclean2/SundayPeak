const logger = require('../Config/logger')

const sendResponse = ({ req, res, data, status }) => {
  logger.info(`${req.method}:${req.url}`, status)
  logger.debug({ data, statusCode: status })

  return res.status(status).json({
    data,
    statusCode: status
  })
}

module.exports = {
  sendResponse
}
