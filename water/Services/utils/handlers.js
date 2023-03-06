const exemptQueries = [
  '/initial',
  '/adventures/all',
  '/adventures/search',
  '/adventures/details',
  'savePasswordReset',
  'resetPassword',
  '/verify',
  '/users/login',
  '/users/create',
  '/users/passwordResetLink',
  '/users/newPassword'
]

const isPath = (originalUrl, query) => {
  return originalUrl.includes(query)
}

const isExempt = (originalUrl) => {
  return exemptQueries.some((query) => originalUrl.includes(query))
}

module.exports = {
  exemptQueries,
  isPath,
  isExempt
}
