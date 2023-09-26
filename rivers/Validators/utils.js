const isDefined = (...values) => {
  return !values.some((value) => [undefined, null, ''].includes(value))
}

const checkPathObj = (path) => {
  if (!Array.isArray(path)) {
    throw 'the path field must be an array of objects defined as [lng, lat]'
  }

  if (!path.length) {
    // resetting the path
    return true
  }

  if (!Array.isArray(path[0])) {
    throw 'the path field must be an array of objects defined as [lng, lat]'
  }
}

const convertPathObject = (path) => {
  return JSON.stringify(path)
}

module.exports = {
  isDefined,
  checkPathObj,
  convertPathObject
}
