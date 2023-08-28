const buildImageUrl = () => {
  const port = process.env.NODE_ENV === 'production' ? '' : ':5000'
  const hostname =
    process.env.NODE_ENV === 'production'
      ? 'api.sundaypeak.com'
      : 'sundaypeak.local'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${hostname}${port}/images/`.replace(/ /g, '')
}

module.exports = {
  buildImageUrl
}
