const { UserInputError } = require('apollo-server-express');

const Users = require('../SampleData/UserData.json');

const validateCreateUser = async ({ email, password, password2, ...newUser }) => {
	if (!email.includes('@')) {
		throw new SyntaxError('Email is not valid')
	} else {
		const emailSuffix = email.split('@')[1];

		if (!emailSuffix.includes('.')) {
			throw new SyntaxError('Email is not valid');
		}
	}

	if (Users.findIndex((user) => user.email === email) > -1) {
		throw new SyntaxError('This user is already registered');
	}

	if (password.length < 5) {
		throw new SyntaxError('Password length must be at least 5 characters');
	}

	if (password.length > 30) {
		throw new SyntaxError('Password length must be less than 50 characters');
	}

	if (password !== password2) {
		throw new SyntaxError('Passwords do not match');
	}

	return true;
};

const validateLoginUser = async ({ email, password }) => {
	if (!email) {
		throw new SyntaxError('email field is required');
	}

	if (!password) {
		throw new SyntaxError('password field is required');
	}

	return true;
}

module.exports = {
	validateCreateUser,
	validateLoginUser
};