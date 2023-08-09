const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()]
})

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.MongoDB({
      level: 'info',
      db: `mongodb+srv://byf:${process.env.MONGO_PASS}@splogging.lpeaxvy.mongodb.net/?retryWrites=true&w=majority`,
      dbName: 'spLogging',
      collection: 'couloir_logs',
      tryReconnect: true,
      options: {
        useUnifiedTopology: true
      }
    })
  )
}

module.exports = logger
