const { config } = require('dotenv')

config()

const isLocal = ['dev', 'text'].includes(process.env.NODE_ENV)

module.exports = {
  isLocal
}
