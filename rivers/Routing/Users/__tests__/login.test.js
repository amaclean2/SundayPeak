const request = require('supertest')
const {
	loginUserBody,
	USERS_PREFIX,
	resetDB,
	createTestUser
} = require('../../../__tests__')
const app = require('../../../app')
const errorTexts = require('../../../ResponseHandling/ResponseText/errors')
const { NOT_ACCEPTABLE, SUCCESS } = require('../../../ResponseHandling/statuses')
const userDuplicateTests = require('./duplications')
const db = require('../../../Config/db')

const route = '/login'

describe('POST /login', () => {
	beforeAll(async () => await createTestUser(db))
	afterAll(async () => await resetDB(db))

	describe('logging in a user', () => {

		it('should ensure the validator checks an email exists in the request body', async () => {
			// email

			const missingBody = {
				...loginUserBody
			}

			delete missingBody.email

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(missingBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.request_body.password).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.missingFieldsLogin.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure the validator checks a password exists in the request body', async () => {
			// password

			const missingBody = {
				...loginUserBody
			}

			delete missingBody.password

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(missingBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.request_body.email).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.missingFieldsLogin.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure incorrect emails return an error', async () => {
			const errorBody = {
				...loginUserBody
			}

			errorBody.email = 'abc123'

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(errorBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toBe(errorTexts.invalidField.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure a token gets generated', async () => {
			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(loginUserBody)

			expect(response.statusCode).toBe(SUCCESS)
			expect(response.body.data).toBeDefined()
			expect(response.body.data.token).toBeDefined()
			expect(response.body.data.token.length).toBeGreaterThan(10)
		})

		userDuplicateTests({ route, data: loginUserBody })
	})
})