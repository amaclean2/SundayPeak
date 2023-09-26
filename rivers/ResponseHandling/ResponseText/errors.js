const {
  NOT_ACCEPTABLE,
  SERVER_ERROR,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN
} = require('../statuses')

const errorTexts = {
  // token errors
  invalidToken: {
    messageText: 'Invalid request, must include a token',
    status: FORBIDDEN
  },
  TokenExpiredError: {
    messageText: 'Your token has expired. Please log in again',
    status: FORBIDDEN
  },

  // cors error
  corsError: {
    messageText: (vars = {}) =>
      `The CORS policy for this API does not allow access = require(${vars.origin}`,
    status: FORBIDDEN
  },

  // user errors
  missingFieldsCreateUser: {
    messageText:
      'Email, Password, and Confirm Password fields are required. Please try again.',
    status: NOT_ACCEPTABLE
  },
  missingLegal: {
    messageText:
      'User must agree to the terms and conditions before creating an account',
    status: NOT_ACCEPTABLE
  },
  legalBool: {
    messageText: 'legal field must be either true or false',
    status: NOT_ACCEPTABLE
  },
  flNameAlpha: {
    messageText: 'first and last names must be only letters',
    status: NOT_ACCEPTABLE
  },
  missingFieldsLogin: {
    messageText: 'Email and Password fields are required. Please try again.',
    status: NOT_ACCEPTABLE
  },
  invalidField: {
    messageText:
      'The email or password you provided is invalid. Please try again.',
    status: NOT_ACCEPTABLE
  },
  preexistingUser: {
    messageText: 'This user already exists.',
    status: NOT_ACCEPTABLE
  },
  passwordOutOfRange: {
    messageText: 'Passwords must be between 5 and 50 characters.',
    status: NOT_ACCEPTABLE
  },
  nonMatchingPasswords: {
    messageText:
      'The password and confirm password fields have different values. Please ensure they are the same',
    status: NOT_ACCEPTABLE
  },
  missingFieldsFetchUser: {
    messageText: 'email or id field must exist',
    status: NOT_ACCEPTABLE
  },
  serverValidateUser: {
    messageText: 'Server Error: Could not validate user',
    status: SERVER_ERROR
  },
  serverLoginUser: {
    messageText: 'Server Error: Could not log in user',
    status: SERVER_ERROR
  },
  serverFollowUser: {
    messageText: 'Server Error: Could not follow this user',
    status: SERVER_ERROR
  },
  serverGetFriends: {
    messageText: 'Server Error: Could not get users',
    status: SERVER_ERROR
  },
  newPasswordRequired: {
    messageText:
      'A new password is required to meed the new security standards. Please click forgot my password.',
    status: NOT_ACCEPTABLE
  },
  noAccountExists: {
    messageText: 'This account cannot be found. Please try again.',
    status: NOT_FOUND
  },
  notLoggedIn: {
    messageText: 'User is not logged in',
    status: UNAUTHORIZED
  },
  idQueryRequired: {
    messageText: 'The id query parameter is required to select a user',
    status: NOT_ACCEPTABLE
  },
  JsonWebTokenError: {
    messageText: 'The authorization token you gave was not supported',
    status: UNAUTHORIZED
  },
  leaderRequired: {
    messageText: 'The "leader_id" field is required in the request body',
    status: NOT_ACCEPTABLE
  },
  alreadyFollowed: {
    messageText: 'You already follow this user',
    status: NOT_ACCEPTABLE
  },
  editFieldsFormat: {
    messageText: 'One or more of the edit fields are formatted incorrectly',
    status: NOT_ACCEPTABLE
  },
  passwordNotFound: {
    messageText: 'The password is incorrect for this email. Please try again.',
    status: NOT_ACCEPTABLE
  },

  // adventure errors
  missingAdventureProperty: {
    messageText:
      'The request body must contain properties adventure_type, adventure_name, coordinates: {lat, lng}, nearest_city, and public.',
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
  serverDeleteAdventure: {
    messageText: 'Server Error: Could not delete this adventure',
    status: SERVER_ERROR
  },
  adventureIdFieldRequired: {
    messageText: 'The id and type query parameters are required',
    status: NOT_ACCEPTABLE
  },
  boundingBox: {
    messageText: 'The bounding_box must have a NE component and a SW component',
    status: NOT_ACCEPTABLE
  },
  boundingBoxType: {
    messageText: 'bounding_box must be an object',
    status: NOT_ACCEPTABLE
  },
  editAdventureIdMissing: {
    messageText: 'The adventure_id field must be present on an edit request',
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
    messageText:
      'adventure_id, and public fields are required in the request body',
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
  },
  finishActivityFields: {
    messageText:
      'A rating and difficulty must be provided when an adventure is completed. Ratings and difficulties should be formatted as `newRating:oldRating:oldRatingTally`',
    status: NOT_ACCEPTABLE
  },

  // picture errors
  getUserPicturesError: {
    message: 'User id field required',
    status: NOT_ACCEPTABLE
  },
  deleteUserPicturesError: {
    message: 'file_name filed is required',
    status: NOT_ACCEPTABLE
  },
  serverUploadPictures: {
    message: 'Could not upload this picture',
    status: SERVER_ERROR
  }
}

module.exports = errorTexts
