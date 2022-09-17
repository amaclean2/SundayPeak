const exemptQueries = [
	'/adventures/all',
	'/adventures/details',
	'savePasswordReset',
	'resetPassword',
	'/verify',
	'/users/login',
	'/users/create'
]

const isPath = (req, query) => {
	return req.originalUrl.includes(query)
}

const isExempt = (req) => {
	return exemptQueries.some((query) => req.originalUrl.includes(query))
}

module.exports = {
	exemptQueries,
	isPath,
	isExempt
}