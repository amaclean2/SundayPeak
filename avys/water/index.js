const { getDBConnectionObject } = require('./Config/connections')
const SQLString = require('sqlstring')
const mysql = require('mysql2/promise')
const Water = require('./Services')
const AdventureService = require('./Services/adventure.service')
const PasswordService = require('./Services/password.service')
const SearchService = require('./Services/search.service')
const UserService = require('./Services/user.service')
const MessagingService = require('./Services/messages.service')
const {
  createStatements,
  deleteStatements
} = require('./DB/Statements/testStatements')
const ZoneService = require('./Services/zone.service')
const logger = require('./Config/logger')

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
    this.sendQuery = (sqlStatement, sqlValues) => {
      const formattedStatement = SQLString.format(sqlStatement, sqlValues)
      logger.debug(`sql statement: ${formattedStatement}`)
      return pool.execute(formattedStatement)
    }

    this.createTables = async () => {
      for (const statement of createStatements) {
        await this.sendQuery(statement)
      }
    }
    this.removeTables = async () => {
      for (const statement of deleteStatements) {
        await this.sendQuery(statement)
      }
    }

    this.userService = new UserService(this.sendQuery, jwtSecret)
    this.adventureService = new AdventureService(this.sendQuery, jwtSecret)
    this.zoneService = new ZoneService(this.sendQuery, jwtSecret)
    this.passwordService = new PasswordService(this.sendQuery, jwtSecret)
    this.validationService = new Water(this.sendQuery, jwtSecret)
    this.searchService = new SearchService(this.sendQuery, jwtSecret)
    this.messagingService = new MessagingService(this.sendQuery, jwtSecret)
  }
}

module.exports = SundayService
