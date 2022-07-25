import { NOT_ACCEPTABLE, SERVER_ERROR, UNAUTHORIZED, NOT_FOUND } from '../statuses.js';

const errorTexts = {
    missingFieldsCreateUser: {
        messageText: 'Email, Password, and Confirm Password fields are required. Please try again.',
        status: NOT_ACCEPTABLE
    },
    missingLegal: {
        messageText: 'User must agree to the terms and conditions before creating an account',
        status: NOT_ACCEPTABLE
    },
    missingFieldsLogin: {
        messageText: 'Email and Password fields are required. Please try again.',
        status: NOT_ACCEPTABLE
    },
    invalidEmail: {
        messageText: 'The email or password you provided is invalid. Please try again.',
        status: NOT_ACCEPTABLE
    },
    invalidPassword: {
        messageText: 'The email or password you provided is invalid. Please try again.',
        status: NOT_ACCEPTABLE
    },
    preexistingUser: {
        messageText: 'This user already exists.',
        status: NOT_ACCEPTABLE
    },
    tooShortPassword: {
        messageText: 'Password length must be at least 5 characters.',
        status: NOT_ACCEPTABLE
    },
    tooLongPassword: {
        messageText: 'Password length must be less than 50 characters.',
        status: NOT_ACCEPTABLE
    },
    nonMatchingPasswords: {
        messageText: 'Passwords do not match.',
        status: NOT_ACCEPTABLE
    },
    serverValidateUser: {
        messageText: 'Server Error: Could not validate user',
        status: SERVER_ERROR
    },
    serverLoginUser: {
        messageText: 'Server Error: Could not login user',
        status: SERVER_ERROR
    },
    serverFollowUser: {
        messageText: 'Server Error: Could not follow this user',
        status: SERVER_ERROR
    },
    noAccountExists: {
        messageText: 'This email cannot be found. Please try again.',
        status: NOT_FOUND
    },
    notLoggedIn: {
        messageText: 'User is not logged in',
        status: UNAUTHORIZED
    },

    // adventure errors
    adventureType: {
        messageText: 'adventure_type is required',
        status: NOT_ACCEPTABLE
    },
    adventureName: {
        messageText: 'adventure_name is required',
        status: NOT_ACCEPTABLE
    },
    creatorId: {
        messageText: 'creator_id is required',
        status: NOT_ACCEPTABLE
    },
    coordinates: {
        messageText: 'coordinates_lat and coordinates_lng are required',
        status: NOT_ACCEPTABLE
    },
    serverGetAdventures: {
        messageText: 'Server Error: Could not get adeventures',
        status: SERVER_ERROR
    },
    serverGetAdventureDetails: {
        messageText: 'Server Error: Could not get the adventure details',
        status: SERVER_ERROR
    },
    serverCreateAdventure: {
        messageText: 'Server Error: Could not create this adventure',
        status: SERVER_ERROR
    },
    adventureIdFieldRequired: {
        messageText: 'The id field is required',
        status: NOT_ACCEPTABLE
    },

    // tick errors
    serverGetTicks: {
        messageText: 'Server Error: Could not get these ticks',
        status: SERVER_ERROR
    },
    serverCreateTick: {
        messageText: 'Server Error: Could not create this tick',
        status: SERVER_ERROR
    },
    invalidTickActivityFields: {
        messageText: 'user_id, adventure_id, and public fields are required',
        status: NOT_ACCEPTABLE
    },

    // activity errors
    serverGetActivities: {
        messageText: 'Server Error: Could not get these activities',
        status: SERVER_ERROR
    },
    serverCreateActivity: {
        messageText: 'Server Error: Could not create this activity',
        status: SERVER_ERROR
    }
};

export default errorTexts;