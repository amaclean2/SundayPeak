const { body } = require('express-validator');

const queries = require('../DB');

const userLoginValidator = () => {
	return [
		body('email')
			.not().isEmpty()
			.withMessage('missingFieldsLogin')
			.isEmail()
			.withMessage('invalidField'),
		body('password')
			.not().isEmpty()
			.withMessage('missingFieldsLogin')
	];
};

const userCreateValidator = () => {
	return [
		body('email')
			.custom((value) => {
				if (!value) throw 'missingFieldsCreateUser';
				return true;
			}).bail()
			.custom(async (value) => {
				const idExists = await queries.checkForUser(value);

				if (idExists) throw 'preexistingUser';
				return true;
			}).bail()
			.isEmail().bail()
			.withMessage('invalidField'),
		body('password')
			.not().isEmpty().bail()
			.withMessage('missingFieldsCreateUser')
			.isLength({ min: 5, max: 30 }).bail()
			.withMessage('passwordOutOfRange'),
		body('password_2')
			.not().isEmpty().bail()
			.withMessage('missingFieldsCreateUser')
			.custom((value, { req }) => {
				if (value !== req.body.password) throw 'nonMatchingPasswords';

				return true;
			}).bail(),
		body('first_name')
			.optional()
			.isAlpha().bail()
			.withMessage('flNameAlpha')
			.not().isEmpty().bail()
			.trim(),
		body('last_name')
			.optional()
			.isAlpha().bail()
			.withMessage('flNameAlpha')
			.not().isEmpty().bail()
			.trim().bail(),
		body('legal')
			.custom((value) => {
				if (!value) throw 'missingLegal';

				return true;
			}).bail()
			.isBoolean().bail()
			.withMessage('legalBool')
	];
};

module.exports = {
	userLoginValidator,
	userCreateValidator
};