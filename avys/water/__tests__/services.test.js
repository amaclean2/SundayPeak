const SundayService = require('..')

jest.mock('../Services/utils/sharp')

describe('basic service layer testing', () => {
  beforeAll(async () => {
    serviceHandler = new SundayService(
      {
        host: 'localhost',
        user: 'root',
        password: 'skiing',
        database: 'test_services',
        port: '3310'
      },
      'secret'
    )

    await serviceHandler.createTables()
  })
  afterAll(async () => {
    // adding data to searchable users and searchable adventures happens asynchronously
    // not waiting to delete the tables was deleting the tables before the query could finish
    setTimeout(async () => {
      await serviceHandler.removeTables()
    }, 100)
  })
  describe('basic service testing', () => {
    test('a test should be able to run', () => {
      expect(true).toBeDefined()
    })
  })
})
