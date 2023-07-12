const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.MongoDB({
      level: 'info',
      db: 'mongodb://logs_db:27017',
      dbName: 'sundaypeak_logger',
      collection: 'river_logs',
      tryReconnect: true,
      options: {
        useUnifiedTopology: true
      }
    })
  )
}

module.exports = logger
