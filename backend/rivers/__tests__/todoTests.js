const request = require('supertest')
const app = require('../app')
const logger = require('../Config/logger')
const { CREATED, SUCCESS } = require('../ResponseHandling')
const runDefaultTests = require('./defaultTests')

const todoTests = () => {
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

    const createTodoResponse = await request(app)
      .post('/todo_adventures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ adventure_id: adventureId, public: true })

    expect(createTodoResponse.body.statusCode).toBe(CREATED)
    data = runDefaultTests({
      responseBody: createTodoResponse.body
    })
    expect(data.todo).toBeDefined()
    expect(data.todo.user_todo_field).toBeDefined()
    expect(data.todo.adventure_todo_field).toBeDefined()
    logger.info(JSON.stringify({ todo: data.todo }))
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
    expect(data.adventure.todo_users).toBeDefined()
    expect(data.adventure.todo_users.length).toBe(1)
  })

  test('the user has a todo field', async () => {
    const signedInUser = await request(app)
      .get('/users/loggedIn')
      .set('Authorization', `Bearer ${authToken}`)

    expect(signedInUser.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({ responseBody: signedInUser.body })
    expect(data.user).toBeDefined()
    expect(data.user.todo_adventures).toBeDefined()
    expect(data.user.todo_adventures.length).toBe(1)
  })
}

module.exports = todoTests
