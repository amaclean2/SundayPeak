const request = require('supertest')
const app = require('../app')
const { CREATED, SUCCESS } = require('../ResponseHandling')
const runDefaultTests = require('./defaultTests')

const completedTests = () => {
  let authToken, adventureId
  test('adventure can be marked as todo', async () => {
    const userLogin = await request(app).post('/users/login').send({
      email: 'andrew@email.com',
      password: 'skiing'
    })

    expect(userLogin.body.statusCode).toBe(SUCCESS)
    let data = runDefaultTests({ responseBody: userLogin.body })
    expect(data.user).toBeDefined()
    expect(data.token).toBeDefined()
    authToken = data.token

    const getSingleAdventureResponse = await request(app)
      .get('/adventures/details?id=1&type=ski')
      .set('Authorization', `Bearer ${authToken}`)

    expect(getSingleAdventureResponse.body.statusCode).toBe(SUCCESS)
    data = runDefaultTests({
      responseBody: getSingleAdventureResponse.body
    })
    expect(data.adventure).toBeDefined()
    expect(data.adventure.id).toBeDefined()
    adventureId = data.adventure.id

    const createCompletedResponse = await request(app)
      .post('/completed_adventures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ adventure_id: adventureId, public: true })

    expect(createCompletedResponse.body.statusCode).toBe(CREATED)
    data = runDefaultTests({
      responseBody: createCompletedResponse.body
    })
    expect(data.completed).toBeDefined()
    expect(data.completed.user_completed_field).toBeDefined()
    expect(data.completed.adventure_completed_field).toBeDefined()
  })

  test('the adventure has a todo field', async () => {
    const getSingleAdventureResponse = await request(app)
      .get('/adventures/details?id=1&type=ski')
      .set('Authorization', `Bearer ${authToken}`)

    expect(getSingleAdventureResponse.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({
      responseBody: getSingleAdventureResponse.body
    })
    expect(data.adventure).toBeDefined()
    expect(data.adventure.id).toBeDefined()
    expect(data.adventure.completed_users).toBeDefined()
    expect(data.adventure.completed_users.length).toBe(1)
    expect(data.adventure.todo_users.length).toBe(0)
  })

  test('the user has a todo field', async () => {
    const signedInUser = await request(app)
      .get('/users/loggedIn')
      .set('Authorization', `Bearer ${authToken}`)

    expect(signedInUser.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({ responseBody: signedInUser.body })
    expect(data.user).toBeDefined()
    expect(data.user.completed_adventures).toBeDefined()
    expect(data.user.completed_adventures.length).toBe(1)
    expect(data.user.todo_adventures.length).toBe(0)
  })
}

module.exports = completedTests
