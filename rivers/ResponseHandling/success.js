const logger = require('../Config/logger')

const sendResponse = ({ req, res, data, status }) => {
  logger.info(`${req.method}:${req.url}`, status)
  // commenting this out is a hot fix for now, but I need to rewrite the debugger so that
  // it gives up after a comment size that's too large

  logger.debug({ data, statusCode: status })

  return res.status(status).json({
    data,
    statusCode: status
  })
}

module.exports = {
  sendResponse
}
