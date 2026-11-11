const Water = require('.')
const logger = require('../Config/logger')

class SearchService extends Water {
  constructor(sendQuery, jwtSecret) {
    super(sendQuery, jwtSecret)
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.keystring
   * @param {number} params.userId
   * @param {boolean} params.amongFriends
   * @returns {Promise<Object[]>} | either a list of users in the friend group of the provided userId or all users that match the search string
   */
  async userSearch({ searchText, userId, amongFriends = false }) {
    try {
      logger.info(`searching for ${searchText}`)
      logger.info(`searching among friends: ${amongFriends}`)

      return amongFriends
        ? await this.searchDB.friendSearch({ userId, searchText })
        : await this.searchDB.userSearch({ userId, searchText })
    } catch (error) {
      logger.info(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.searchText
   * @param {number} params.parentId
   * @returns {Promise<Object[]>} a list of adventures, with parentId excluding adventures in the current zone, without all adventures matching the search
   */
  async adventureSearch({ searchText, parentId }) {
    try {
      return parentId
        ? await this.searchDB.adventureSearchExcludingZone({
            parentId,
            searchText
          })
        : await this.searchDB.adventureSearch({ searchText })
    } catch (error) {
      logger.info(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.searchText
   * @param {number} params.parentId
   * @returns {Promise<Object[]>} a list of zones, if parentId is provided excluding zones inside the given parent, otherwise all zones matching the search string
   */
  async zoneSearch({ searchText, parentId }) {
    try {
      return parentId
        ? await this.searchDB.zoneSearchExcludingParent({
            parentId,
            searchText
          })
        : await this.searchDB.zoneSearch({ searchText })
    } catch (error) {
      logger.info(error)
      throw error
    }
  }
}

module.exports = SearchService
