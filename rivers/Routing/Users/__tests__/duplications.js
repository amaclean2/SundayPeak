const request = require('supertest')

const app = require('../../../app')
const { CREATED, SUCCESS } = require('../../../ResponseHandling/statuses')
const { USERS_PREFIX } = require('../../../__tests__')

const userDuplicateTests = async ({ route, data }) => {
	it('should ensure all the associated lists are returned back to the user along with the user object', async () => {
		const response = await request(app).post(`${USERS_PREFIX}${route}`).send(data)

		expect(response?.body?.data?.user).toBeDefined()
		const {user} = response.body.data

		expect(user.activity_count).toBeDefined()
		expect(user.ticks).toBeDefined()
		expect(user.follower_count).toBeDefined()
		expect(user.following_count).toBeDefined()
		expect(user.images).toBeDefined()
	})

	it('should ensure the password doesn\'t exist in the returned user object', async () => {
		const response = await request(app).post(`${USERS_PREFIX}${route}`).send(data)

		expect(response.body.data.user).toBeDefined()
		const {user} = response.body.data

		expect(user.password).not.toBeDefined()
	})

	it('should return everything inside { data: { user: {}, token }, status }', async () => {
		const response = await request(app).post(`${USERS_PREFIX}${route}`).send(data)

		expect(response.body.data).toBeDefined()
		expect(response.body.statusCode).toBeDefined()
		expect(response.body.data.user).toBeDefined()
		expect(response.body.data.token).toBeDefined()
	})

	it('should return errors in the format { error: { message, ...otherErrorInfo }, status }', async () => {
		const errorBody = { ...data }

		delete errorBody.password

		const response = await request(app).post(`${USERS_PREFIX}${route}`).send(errorBody)

		expect(response.body.error).toBeDefined()
		expect(response.body.statusCode).toBeDefined()
		expect(response.body.error.message).toBeDefined()
	})

	it('should ensure all correct responses are formatted as JSON and have a 2xx status code', async () => {
		const response = await request(app).post(`${USERS_PREFIX}${route}`).send(data)

		expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
		expect([CREATED, SUCCESS]).toContain(response.statusCode)
	})
}

module.exports = userDuplicateTests