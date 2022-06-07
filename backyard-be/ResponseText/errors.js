const errorTexts = {
    missingFieldsCreateUser: 'Email, Password, and Confirm Password fields are required',
    missingFieldsLogin: 'Email and Password fields are required',
    invalidEmail: 'The email or password you provided is invalid. Please try again',
    invalidPassword: 'The email or password you provided is invalid. Please try again',
    preexistingUser: 'This user already exists',
    tooShortPassword: 'Password length must be at least 5 characters',
    tooLongPassword: 'Password length must be less than 50 characters',
    nonMatchingPasswords: 'Passwords do not match',
    serverValidateUser: 'Server Error: Could not validate user',
    serverLoginUser: 'Server Error: Could not login user',
    serverLoginUser: 'Server Error: Could not create user',
    noAccountExists: 'This email cannot be found'
};

module.exports = errorTexts;