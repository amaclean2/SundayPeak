const isDefined = (...values) => {
  return !values.some((value) => [undefined, null].includes(value))
}

module.exports = {
  isDefined
}