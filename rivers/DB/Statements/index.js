const userStatements = require('./Users')
const adventureStatements = require('./Adventures')
const tickStatements = require('./Ticks')
const activityStatements = require('./Activities')
const passwordResetStatements = require('./PasswordReset')
const followerStatements = require('./Followers')
const pictureStatements = require('./Pictures')

module.exports = {
  ...userStatements,
  ...adventureStatements,
  ...tickStatements,
  ...activityStatements,
  ...passwordResetStatements,
  ...followerStatements,
  ...pictureStatements
}
