const exemptQueries = [
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

const isExempt = (req) => {
  return exemptQueries.some((query) => req.originalUrl.includes(query))
}

module.exports = {
  exemptQueries,
  isExempt
}
