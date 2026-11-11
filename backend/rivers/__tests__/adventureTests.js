const request = require('supertest')
const app = require('../app')
const { CREATED, SUCCESS, NO_CONTENT } = require('../ResponseHandling')
const runDefaultTests = require('./defaultTests')

const adventureTests = () => {
  let authToken, userId, adventureId, adventureType, adventureName
  test('create an adventure', async () => {
    const userLogin = await request(app).post('/users/login').send({
      email: 'andrew@email.com',
      password: 'skiing'
    })

    expect(userLogin.body.statusCode).toBe(SUCCESS)
    let data = runDefaultTests({ responseBody: userLogin.body })
    expect(data.user).toBeDefined()
    userId = data.user.id
    expect(data.token).toBeDefined()
    authToken = data.token

    const localAdventureType = 'ski'
    adventureName = 'My First Ski'
    const adventureResponse = await request(app)
      .post('/adventures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        adventure_type: localAdventureType,
        adventure_name: adventureName,
        coordinates: {
          lat: 10,
          lng: 11
        },
        nearest_city: 'Truckee, California',
        public: true
      })

    expect(adventureResponse.body.statusCode).toBe(CREATED)
    data = runDefaultTests({ responseBody: adventureResponse.body })
    expect(data.adventure).toBeDefined()
    expect(data.adventure.id).toBeDefined()
    expect(data.adventure.adventure_type).toBe(localAdventureType)
    adventureId = data.adventure.id
    adventureType = data.adventure.adventure_type
    expect(data.adventure.creator_id).toBe(userId)
    expect(data.all_adventures).toBeDefined()
    expect(data.all_adventures.features.length).toBe(1)
  })

  test('get a geojson object with all the adventures', async () => {
    const getAdventuresResponse = await request(app)
      .get(`/adventures/all?type=${'ski'}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(getAdventuresResponse.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({ responseBody: getAdventuresResponse.body })
    expect(data.adventures).toBeDefined()
    expect(data.adventures.features.length).toBe(1)
  })

  test('get a specific adventure', async () => {
    const getSingleAdventureResponse = await request(app)
      .get(`/adventures/details?id=${adventureId}&type=${adventureType}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(getSingleAdventureResponse.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({
      responseBody: getSingleAdventureResponse.body
    })
    expect(data.adventure).toBeDefined()
    expect(data.adventure.id).toBeDefined()
    expect(data.adventure.adventure_type).toBe(adventureType)
    expect(data.adventure.creator_id).toBe(userId)
    expect(data.adventure.coordinates).toBeDefined()
    expect(data.adventure.coordinates.lat).toBeDefined()
    expect(data.adventure.coordinates.lng).toBeDefined()
  })

  test('edit an adventure', async () => {
    const editAdventureResponse = await request(app)
      .put('/adventures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        field: {
          name: 'summit_elevation',
          value: 8200,
          adventure_id: adventureId,
          adventure_type: adventureType
        }
      })

    expect(editAdventureResponse.status).toBe(NO_CONTENT)

    const getAdventureResponse = await request(app)
      .get(`/adventures/details?id=${adventureId}&type=${adventureType}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(getAdventureResponse.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({
      responseBody: getAdventureResponse.body
    })

    expect(data.adventure).toBeDefined()
    expect(data.adventure.summit_elevation).toBe(8200)
  })

  test('search for an adventure', async () => {
    const searchText = 'rstski'
    const searchAdventureResponse = await request(app)
      .get(`/adventures/search?search=${searchText}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(searchAdventureResponse.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({
      responseBody: searchAdventureResponse.body
    })

    expect(data.adventures).toBeDefined()
    expect(data.adventures.length).toBe(1)
    expect(data.adventures[0].adventure_name).toBe(adventureName)
  })
}

module.exports = adventureTests
