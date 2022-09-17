const errorTexts = require('../ResponseHandling/ResponseText/errors')

const allowedOrigins = [
	'http://localhost:5000',
	'http://localhost:3000',
	'http://localhost',
	'https://friends-dot-backyardfriends.wl.r.appspot.com'
]

const corsHandler = (origin, cb) => {
	if (!origin) return cb(null, true)
	else if (allowedOrigins.indexOf(origin) === -1) {
		return cb(new Error(errorTexts.corsError.messageText({ origin })), false)
	} else {
		return cb(null, true)
	}
}

module.exports = {
	allowedOrigins,
	corsHandler
}