const SundayService = require('@amaclean2/sundaypeak-water')

const serviceHandler = new SundayService(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  process.env.JWT_SECRET
)

module.exports = serviceHandler
