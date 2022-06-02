const validateCreateUser = async ({ email, password, ...newUser }) => {
	if (!email.includes('@')) {
		throw new UserInputError('Email is not valid');
	} else {
		const emailSuffix = email.split('@')[1];

		if (!emailSuffix.includes('.')) {
			throw new UserInputError('Email is not valid');
		}
	}

	if (Users.findIndex((user) => user.email === email) > -1) {
		throw new UserInputError('This user is already registered');
	}

	if (password.length < 5) {
		throw new UserInputError('Password length must be at least 5 characters');
	}

	if (password.length > 30) {
		throw new UserInputError('Password length must be less than 50 characters');
	}

	return true;
};

module.exports = {
	validateCreateUser
};