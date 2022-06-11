const { checkForUser: checkForUserDB } = require('../DB');
const { returnError } = require('../ErrorHandling');

const { NOT_ACCEPTABLE, SERVER_ERROR } = require('../statuses');

const validateCreateUser = async (req, res, next) => {
	const { email, password, password2 } = req.body;

	try {
		if (!email || !password || !password2) {
			return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'missingFieldsCreateUser' });
		} else if (!email.includes('@')) {
			return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'invalidEmail' });
		} else {
			const emailSuffix = email.split('@')[1];

			if (!emailSuffix.includes('.')) {
				return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'invalidEmail' });
			} else {
				const idExists = await checkForUserDB(email);
				if (idExists) {
					return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'preexistingUser' });
				} else if (password.length < 5) {
					return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'tooShortPassword' });
				} else if (password.length > 30) {
					return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'tooLongPassword' });
				} else if (password !== password2) {
					return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'nonMatchingPasswords' });
				} else {
					next();
				}
			}
		}
	} catch (error) {
		return returnError({ req, res, status: SERVER_ERROR, message: 'serverValidateUser', error });
	}
};

const validateLoginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'missingFieldsLogin' });
		} else {
			next();
		}
	} catch (error) {
		return returnError({ req, res, status: SERVER_ERROR, message: 'serverValidateUser', error });
	}
}

module.exports = {
	validateCreateUser,
	validateLoginUser
};