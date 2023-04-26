const { config } = require('dotenv')

config()

const isLocal = ['development', 'test'].includes(process.env.NODE_ENV)

module.exports = {
  isLocal
}
