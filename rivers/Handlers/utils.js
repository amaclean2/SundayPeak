const buildImageUrl = ({ hostname, protocol }) => {
  const port = process.env.NODE_ENV === 'production' ? '' : ':5000'
  return `${protocol}://${hostname}${port}/images/`.replace(/ /g, '')
}

module.exports = {
  buildImageUrl
}
