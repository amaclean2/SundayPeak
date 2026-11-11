const winston = require('winston')

// Logs go to stdout only; pm2 captures them on the server (pm2 logs avys).
// Production skips debug output such as every SQL statement.
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

module.exports = logger
