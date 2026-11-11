const isExempt = (originalUrl) => {
  return exemptQueries.some((query) => originalUrl.includes(query))
}

module.exports = {
  exemptQueries,
  isExempt
}
