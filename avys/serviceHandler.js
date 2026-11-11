// The one Water (data layer) instance shared by the REST API (rivers) and
// the websocket layer (couloirs), so both use the same database pool.
const SundayService = require('./water')

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
