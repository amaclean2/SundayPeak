const errorTexts = {
    missingFieldsCreateUser: 'Email, Password, and Confirm Password fields are required. Please try again.',
    missingLegal: 'User must agree to the terms and conditions before creating an account',
    missingFieldsLogin: 'Email and Password fields are required. Please try again.',
    invalidEmail: 'The email or password you provided is invalid. Please try again.',
    invalidPassword: 'The email or password you provided is invalid. Please try again.',
    preexistingUser: 'This user already exists.',
    tooShortPassword: 'Password length must be at least 5 characters.',
    tooLongPassword: 'Password length must be less than 50 characters.',
    nonMatchingPasswords: 'Passwords do not match.',
    serverValidateUser: 'Server Error: Could not validate user',
    serverLoginUser: 'Server Error: Could not login user',
    serverLoginUser: 'Server Error: Could not create user',
    noAccountExists: 'This email cannot be found. Please try again.',

    // adventure errors
    adventureType: 'adventure_type is required',
    adventureName: 'adventure_name is required',
    creatorId: 'creator_id is required',
    coordinates: 'coordinates_lat and coordinates_lng are required',
};

module.exports = errorTexts;