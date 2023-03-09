const runDefaultTests = ({ responseBody }) => {
  expect(responseBody.data).toBeDefined()
  return responseBody.data
}

module.exports = runDefaultTests
