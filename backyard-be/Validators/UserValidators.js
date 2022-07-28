import { body } from 'express-validator';

import { checkForUser } from '../DB';

export const userLoginValidator = () => {
	return [
		body('email')
			.not().isEmpty()
			.withMessage('missingFieldsLogin')
			.isEmail()
			.withMessage('invalidEmail'),
		body('password')
			.not().isEmpty()
			.withMessage('missingFieldsLogin')
	];
};

export const userCreateValidator = () => {
	return [
		body('email')
			.not().isEmpty()
			.withMessage('missingFieldsCreateUser')
			.isEmail()
			.withMessage('invalidEmail')
			.custom(async (value) => {
				const idExists = await checkForUser(value);

				if (idExists) throw 'preexistingUser';

				return true;
			}),
		body('password')
			.not().isEmpty()
			.withMessage('missingFieldsCreateUser')
			.isLength({ min: 5, max: 30 })
			.withMessage('passwordOutOfRange'),
		body('password_2')
			.not().isEmpty()
			.withMessage('missingFieldsCreateUser')
			.custom((value, { req }) => {
				if (value !== req.body.password) throw 'nonMatchingPasswords';

				return true;
			}),
		body('first_name')
			.optional()
			.isAlpha()
			.withMessage('flNameAlpha')
			.not().isEmpty()
			.trim(),
		body('last_name')
			.optional()
			.isAlpha()
			.withMessage('flNameAlpha')
			.not().isEmpty()
			.trim(),
		body('legal')
			.not().isEmpty()
			.withMessage('missingLegal')
			.isBoolean()
			.withMessage('legalBool')
			.equals(true)
			.withMessage('missingLegal')
	];
};