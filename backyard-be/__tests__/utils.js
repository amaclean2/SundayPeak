const cryptoHandlers = require('../Crypto')
const {
	deleteStatements,
	testCreateUserStatement,
	getTestUserIdStatement,
	testCreateSecondUserStatement 
} = require('../DB/testStatements')
const authService = require('../Services/auth.service')

const newUserBody = {
	email: 'abc@email.com',
	password: '12345',
	password_2: '12345',
	legal: true,
	first_name: 'Test',
	last_name: 'User'
}

const loginUserBody = {email: 'user@email.com',
	password: '12345'}

const USERS_PREFIX = '/api/users'

const resetDB = async (db) => {
	for (const statement of deleteStatements) {
		await db.execute(statement)
	}
}

const createTestUser = async (db) => {
	const password = cryptoHandlers.hashPassword('12345')
	await db.execute(testCreateUserStatement, [password])
}

const createSecondTestUser = async (db) => {
	const password = cryptoHandlers.hashPassword('23456')
	const [response] = await db.execute(testCreateSecondUserStatement, [password])
	const { insertId } = response

	return insertId
}

const loginTestUser = async (db) => {
	const [response] = await db.execute(getTestUserIdStatement)
	const userId = response[0].id
	const token = authService.issue({ id: userId })

	return token
}

module.exports = {
	newUserBody,
	loginUserBody,
	USERS_PREFIX,
	resetDB,
	createTestUser,
	createSecondTestUser,
	loginTestUser
}