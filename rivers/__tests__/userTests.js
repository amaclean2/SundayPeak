const request = require('supertest')
const app = require('../app')
const { CREATED, SUCCESS, NO_CONTENT } = require('../ResponseHandling')
const runDefaultTests = require('./defaultTests')

const userTests = () => {
  let access_token, firstUserId, secondUserId
  test('initial endpoint', async () => {
    const response = await request(app).get('/services/initial')

    expect(response.body.statusCode).toBe(SUCCESS)
    expect(response.status).toBe(SUCCESS)
    const data = runDefaultTests({ responseBody: response.body })
    expect(data.mapbox_token).toBeDefined()
    expect(data.map_style).toBeDefined()
  })

  test('create a user', async () => {
    const createUserResponse = await request(app).post('/users').send({
      email: 'andrew@email.com',
      first_name: 'Andrew',
      last_name: 'Maclean',
      password: 'skiing',
      password_2: 'skiing',
      legal: 'true'
    })

    expect(createUserResponse.body.statusCode).toBe(CREATED)
    const data = runDefaultTests({ responseBody: createUserResponse.body })
    expect(data.user).toBeDefined()
    expect(data.token).toBeDefined()

    const { user } = data
    expect(user.friends.length).toBe(0)
    expect(user.images.length).toBe(0)
    expect(user.completed_adventures.length).toBe(0)
    expect(user.todo_adventures.length).toBe(0)
    expect(user.id).toBeDefined()
    expect(user.profile_picture_url.length).toBeGreaterThan(0)
    firstUserId = user.id
  })

  test('login a user', async () => {
    const loginUserResponse = await request(app).post('/users/login').send({
      email: 'andrew@email.com',
      password: 'skiing'
    })

    expect(loginUserResponse.body.statusCode).toBe(SUCCESS)
    const data = runDefaultTests({ responseBody: loginUserResponse.body })

    expect(data.user).toBeDefined()
    expect(data.token).toBeDefined()

    // eslint-disable-next-line prefer-destructuring
    access_token = data.token
  })

  test('edit a user', async () => {
    const editUserResponse = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        field: {
          name: 'bio',
          value: 'This is something about Andrew'
        }
      })

    expect(editUserResponse.status).toBe(NO_CONTENT)
  })

  test('get a logged in user', async () => {
    const fetchUserResponse = await request(app)
      .get('/users/loggedIn')
      .set('Authorization', `Bearer ${access_token}`)

    const data = runDefaultTests({ responseBody: fetchUserResponse.body })
    expect(data.user).toBeDefined()
    expect(data.user.id).toBeDefined()
    expect(data.user.password).not.toBeDefined()
  })
  test('get another user', async () => {
    const createUserResponse = await request(app).post('/users').send({
      email: 'mark@email.com',
      first_name: 'Mark',
      last_name: 'Cavendish',
      password: 'cycling',
      password_2: 'cycling',
      legal: 'true'
    })

    const data = runDefaultTests({ responseBody: createUserResponse.body })
    secondUserId = data.user.id
    access_token = data.token

    const firstUserDetails = await request(app)
      .get(`/users/id?id=${firstUserId}`)
      .set('Authorization', `Bearer ${access_token}`)

    const secondUserData = runDefaultTests({
      responseBody: firstUserDetails.body
    })
    expect(secondUserData.user).toBeDefined()
    expect(secondUserData.password).not.toBeDefined()
    expect(secondUserData.phone).not.toBeDefined()
  })
  test('follow another user', async () => {
    const followUserResponse = await request(app)
      .get(`/users/follow?leader_id=${firstUserId}`)
      .set('Authorization', `Bearer ${access_token}`)

    const followUserData = runDefaultTests({
      responseBody: followUserResponse.body
    })

    expect(followUserData.user).toBeDefined()
    expect(followUserData.user.id).toBe(secondUserId)
    expect(followUserData.user.friends.length).toBe(1)
    expect(followUserData.user.friends[0].id).toBe(firstUserId)
  })
  test('search for a user', async () => {
    const searchTerm = 'rew@email'
    const searchUserResponse = await request(app)
      .get(`/users/search?search=${searchTerm}`)
      .set('Authorization', `Bearer ${access_token}`)

    const searchUserData = runDefaultTests({
      responseBody: searchUserResponse.body
    })

    expect(searchUserData.users).toBeDefined()
    expect(searchUserData.users.length).toBe(1)
    expect(searchUserData.users[0].display_name).toBeDefined()
    expect(searchUserData.users[0].id).toBeDefined()
    expect(searchUserData.users[0].email).toBeDefined()
    expect(searchUserData.users[0].profile_picture_url).toBeDefined()
  })
}

module.exports = userTests
