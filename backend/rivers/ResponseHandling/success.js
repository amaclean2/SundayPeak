const sendResponse = ({ req, res, data, status }) => {
  req.logger.info(`RESPONSE: ${req.method}:${req.originalUrl}`)
  req.logger.info(`STATUS: ${status}`)

  return res.status(status).json({
    data,
    statusCode: status,
    timestamp: Date.now()
  })
}

module.exports = {
  sendResponse
}
