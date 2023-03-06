const { getDBConnectionObject } = require('./Config/connections')
const mysql = require('mysql2/promise')
const Water = require('./Services')
const AdventureService = require('./Services/adventure.service')
const PasswordService = require('./Services/password.service')
const SearchService = require('./Services/search.service')
const UserService = require('./Services/user.service')

/**
 * @class
 */
class SundayService {
  /**
   *
   * @param {SqlDependencies} sqlDependencies
   * @param {string} jwtSecret | secret used for JsonWebToken
   */
  constructor(sqlDependencies, jwtSecret) {
    const databaseConnectionObject = getDBConnectionObject(sqlDependencies)
    const pool = mysql.createPool({
      ...databaseConnectionObject,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })

    /**
     *
     * @param {string} queryStatement
     * @param {string[]|number[]} queryParameters
     * @returns {Promise<*>} the response from the sql query
     */
    this.sendQuery = (queryStatement, queryParameters) => {
      return pool.execute(queryStatement, queryParameters)
    }

    this.userService = new UserService(this.sendQuery, jwtSecret)
    this.adventureService = new AdventureService(this.sendQuery, jwtSecret)
    this.passwordService = new PasswordService(this.sendQuery, jwtSecret)
    this.validationService = new Water(this.sendQuery, jwtSecret)
    this.searchService = new SearchService(this.sendQuery, jwtSecret)
  }
}

module.exports = SundayService
