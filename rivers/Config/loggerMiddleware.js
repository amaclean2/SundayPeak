const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.request(`${req.method}:${req.url}`, req.body)
  next()
}

module.exports = {
  requestLogger
}
