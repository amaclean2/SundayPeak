const request = require('supertest')
const app = require('../app')
const { CREATED, SUCCESS, NO_CONTENT } = require('../ResponseHandling')
const runDefaultTests = require('./defaultTests')

const userSadPaths = () => {
  test('first user sad path', async () => {
    expect(true).toBe(true)
  })
}

module.exports = userSadPaths
