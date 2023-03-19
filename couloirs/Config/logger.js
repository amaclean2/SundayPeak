import Logger from 'byf-custom-logger'

const logger = new Logger({
  name: 'friends',
  verbose: process.env.NODE_ENV === 'dev',
  storeLogs: false
})

export default logger
