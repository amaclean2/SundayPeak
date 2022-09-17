const request = require('supertest')

const {
	resetDB,
	createTestUser,
	loginTestUser,
	USERS_PREFIX,
	createSecondTestUser,
} = require('../../../__tests__')
const db = require('../../../Config/db')
const app = require('../../../app')
const errorTexts = require('../../../ResponseHandling/ResponseText/errors')
const {
	SUCCESS,
	CREATED,
	ACCEPTED,
	NOT_ACCEPTABLE,
	UNAUTHORIZED
} = require('../../../ResponseHandling')

const route = '/follow'
let token
let secondUserId

describe.only('POST /follow', () => {
	beforeEach(async () => {
		await createTestUser(db)
		token = await loginTestUser(db)
		secondUserId = await createSecondTestUser(db)
	})

	afterEach(async () => {
		await resetDB(db)
	})

	describe('following another user', () => {

		it('should ensure only valid access tokens are authenticated', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: '123' })

			expect(response?.body?.error).toBeDefined()
			expect(response.body.error.message).toBe(errorTexts.JsonWebTokenError.messageText)
			expect(response.statusCode).toBe(UNAUTHORIZED)
		})

		it('should ensure leader_id is in the request body', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({})

			expect(response?.body?.error).toBeDefined()
			expect(response.body.error.message).toBe(errorTexts.leaderRequired.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure a database call to followUser gets made to add the new relationship', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({ leader_id: secondUserId })

			expect(response?.body?.data).toBeDefined()
			expect(response.body.data.leader_id).toBe(secondUserId)
			expect(response.statusCode).toBe(ACCEPTED)
		})

		it('should ensure multiple follows of the same relationship can\'t be made', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({ leader_id: secondUserId })

			expect(response?.body?.data).toBeDefined()
			expect(response.body.data.leader_id).toBe(secondUserId)

			const secondFollowResponse = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({ leader_id: secondUserId })

			expect(secondFollowResponse?.body?.error).toBeDefined()
			expect(secondFollowResponse.body.error.message).toBe(errorTexts.alreadyFollowed.messageText)
			expect(secondFollowResponse.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should return everything inside { data: { follower_id, leader_id, followed }, status }', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({ leader_id: secondUserId })

			expect(response?.body?.data).toBeDefined()
			expect(response.body.statusCode).toBeDefined()
			expect(response.body.data).toBeDefined()
			expect(Object.keys(response.body.data)).toContain('leader_id')
			expect(Object.keys(response.body.data)).toContain('user_id')
			expect(Object.keys(response.body.data)).toContain('followed')
		})

		it('should return errors in the format { error: { message, ...otherErrorInfo }, statusCode }', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({})

			expect(response?.body?.error).toBeDefined()
			expect(response.body.error.message).toBeDefined()
			expect(response.body.statusCode).toBeDefined()
		})

		it('should ensure all correct responses are formatted as JSON and a 2xx status code', async () => {
			const response = await request(app)
				.post(`${USERS_PREFIX}${route}`)
				.set({ authorization: `Bearer ${token}` })
				.send({ leader_id: secondUserId })

			expect([SUCCESS, CREATED, ACCEPTED].includes(response.statusCode)).toBe(true)
			expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
		})
	})
})