const request = require('supertest')

const {
	newUserBody,
	USERS_PREFIX,
	resetDB
} = require('../../../__tests__')
const app = require('../../../app')
const { NOT_ACCEPTABLE } = require('../../../ResponseHandling/statuses')
const errorTexts = require('../../../ResponseHandling/ResponseText/errors')
const userDuplicateTests = require('./duplications')
const db = require('../../../Config/db')

const route = '/create'

describe('POST /create', () => {
	afterEach(async () => await resetDB(db))

	describe('creating a user', () => {
        
		it('should validate a password exists in the request body and error with a 406 otherwise', async () => {
			// password

			const missingBody = {
				...newUserBody
			}

			delete missingBody.password

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(missingBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.missingFieldsCreateUser.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})
		it('should validate a conform password field exists in the request body and error with a 406 otherwise', async () => {
			// password_2

			const missingBody = {
				...newUserBody
			}

			delete missingBody.password_2

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(missingBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.missingFieldsCreateUser.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})
		it('should validate an email exists in the request body and error with a 406 otherwise', async () => {
			// email

			const missingBody = {
				...newUserBody
			}

			delete missingBody.email

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(missingBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.missingFieldsCreateUser.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})
		it('should validate the legal check is checked and error with a 406 otherwise', async () => {
			// legal

			const missingBody = {
				...newUserBody
			}

			delete missingBody.legal

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(missingBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.missingLegal.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure duplicate emails can\'t be saved', async () => {

			await request(app).post(`${USERS_PREFIX}${route}`).send(newUserBody)
			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(newUserBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.preexistingUser.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure invalid passwords can\'t be saved', async () => {
			const errorBody = {
				...newUserBody,
				password: '123'
			}

			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(errorBody)

			expect(response.body.error).toBeDefined()
			expect(response.body.error.message).toEqual(errorTexts.passwordOutOfRange.messageText)
			expect(response.statusCode).toBe(NOT_ACCEPTABLE)
		})

		it('should ensure a token gets generated', async () => {
			const response = await request(app).post(`${USERS_PREFIX}${route}`).send(newUserBody)

			expect(response.body.data).toBeDefined()
			expect(response.body.data.token).toBeDefined()
			expect(response.body.data.token.length).toBeGreaterThan(10)
		})

		userDuplicateTests({ route, data: newUserBody })
	})
})