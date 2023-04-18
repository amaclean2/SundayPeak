const Logger = require('byf-custom-logger')

const logger = new Logger({
  name: 'friends',
  verbose: false,
  storeLogs: false
})
module.exports = logger
