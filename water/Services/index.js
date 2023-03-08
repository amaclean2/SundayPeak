const AdventureDataLayer = require('../DB/DatabaseAdventures')
const CompletedAdventureDataLayer = require('../DB/DatabaseAdventures/CompletedAdventure')
const TodoAdventureDataLayer = require('../DB/DatabaseAdventures/TodoAdventure')
const UserDataLayer = require('../DB/DatabaseUsers')
const MessageDataLayer = require('../DB/DatabaseUsers/messages')
const AuthService = require('./auth.service')

class Water {
  constructor(sqlDependencies, jwtSecret) {
    this.userDB = new UserDataLayer(sqlDependencies)
    this.messageDB = new MessageDataLayer(sqlDependencies)
    this.adventureDB = new AdventureDataLayer(sqlDependencies)
    this.completedDB = new CompletedAdventureDataLayer(sqlDependencies)
    this.todoDB = new TodoAdventureDataLayer(sqlDependencies)
    this.auth = new AuthService(jwtSecret)
  }

  /**
   *
   * @param {Object} validationParameters
   * @param {string} validationParameters.originalUrl | API url
   * @param {string} validationParameters.token | the header containing the access token
   * @returns {Promise} either with a new body object with the user id or a boolean
   */
  validate({ originalUrl, token }) {
    return this.auth.validate({ originalUrl, token })
  }
}

module.exports = Water
