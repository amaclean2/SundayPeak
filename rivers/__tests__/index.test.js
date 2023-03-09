const serviceHandler = require('../Config/services')
const adventureTests = require('./adventureTests')
const completedTests = require('./completedTests')
const todoTests = require('./todoTests')
const userTests = require('./userTests')

describe('url endpoints', () => {
  beforeAll(async () => {
    await serviceHandler.createTables()
  })
  afterAll(async () => {
    await serviceHandler.removeTables()
  })
  userTests()
  adventureTests()
  todoTests()
  completedTests()
})
