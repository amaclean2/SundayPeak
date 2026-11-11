const errorTexts = require('../ResponseHandling/ResponseText/errors')

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://localhost:19000',
  'http://sundaypeak.local:3000',
  'https://sundaypeak.com',
  'http://sundaypeak.com'
]

const corsHandler = (origin, cb) => {
  // we're going to allow all origins for now
  return cb(null, true)


  // if (!origin) return cb(null, true)
  // else if (allowedOrigins.indexOf(origin) === -1) {
  //   return cb(new Error(errorTexts.corsError.messageText({ origin })), false)
  // } else {
  //   return cb(null, true)
  // }
}

module.exports = {
  allowedOrigins,
  corsHandler
}
