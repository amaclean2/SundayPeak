const { checkForUser: checkForUserDB } = require('../DB');
const { returnError, catchBlock } = require('../ErrorHandling');

const validateCreateUser = async (req, res, next) => {
	const { email, password, password2 } = req?.body?.variables?.input;

	try {
		if (!email || !password || !password2) {
			throw returnError({ gql: false, req, res, message: 'missingFieldsCreateUser' });
		} else if (!email.includes('@')) {
			throw returnError({ gql: false, req, res, message: 'invalidEmail' });
		} else {
			const emailSuffix = email.split('@')[1];

			if (!emailSuffix.includes('.')) {
				throw returnError({ gql: false, req, res, message: 'invalidEmail' });
			} else {
				const idExists = await checkForUserDB(email);
				if (idExists) {
					throw returnError({ gql: false, req, res, message: 'preexistingUser' });
				} else if (password.length < 5) {
					throw returnError({ gql: false, req, res, message: 'tooShortPassword' });
				} else if (password.length > 30) {
					throw returnError({ gql: false, req, res, message: 'tooLongPassword' });
				} else if (password !== password2) {
					throw returnError({ gql: false, req, res, message: 'nonMatchingPasswords' });
				} else {
					next();
				}
			}
		}
	} catch (error) {
		throw catchBlock({ gql: false, req, res, message: 'serverValidateUser', error });
	}
};

const validateLoginUser = async (req, res, next) => {
	const { email, password } = req?.body?.variables;

	if (!email || !password) {
		throw returnError({ gql: false, req, res, message: 'missingFieldsLogin' });
	} else {
		next();
	}
}

module.exports = {
	validateCreateUser,
	validateLoginUser
};