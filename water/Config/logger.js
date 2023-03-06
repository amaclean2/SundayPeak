const Logger = require('byf-custom-logger')

const logger = new Logger({
  name: 'friends',
  verbose: process.env.NODE_ENV === 'dev',
  storeLogs: false
})

module.exports = logger
