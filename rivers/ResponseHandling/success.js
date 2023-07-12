const logger = require('../Config/logger')

const sendResponse = ({ req, res, data, status }) => {
  logger.info({ url: `${req.method}:${req.url}`, statusCode: status, data })

  return res.status(status).json({
    data,
    statusCode: status
  })
}

module.exports = {
  sendResponse
}
