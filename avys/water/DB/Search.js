const DataLayer = require('.')
const {
  searchAdventureQuery,
  searchZoneQuery,
  searchAdventuresNotInZoneQuery,
  searchUsersWithinFriendsQuery,
  searchZonesNotInZoneQuery,
  searchUserQuery
} = require('./Statements/SearchQueries')
const { failedQuery } = require('./utils')

class SearchDataLayer extends DataLayer {
  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {string} params.searchText
   * @returns {Promise<Object[]>} a list of users that match the search text, excluding the current user
   */
  async userSearch({ userId, searchText }) {
    try {
      const [results] = await this.sendQuery(searchUserQuery, [
        `"${searchText}"`,
        userId
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {string} params.searchText
   * @returns {Promise<Object[]>} | a list of users that match the search text, excluding the current user. Only users with a relationship to the current user are provided
   */
  async friendSearch({ userId, searchText }) {
    try {
      const [results] = await this.sendQuery(searchUsersWithinFriendsQuery, [
        `"${searchText}"`,
        userId,
        userId,
        userId
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.searchText
   * @returns {Promise<Object[]>} a list of adventures that match the search text
   */
  async adventureSearch({ searchText }) {
    try {
      const [results] = await this.sendQuery(searchAdventureQuery, [
        `"${searchText}"`
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.searchText
   * @param {number} params.parentId
   * @returns {Promise<Object[]>} a list of adventures that match the search text excluding any direct children of the zoneId
   */
  async adventureSearchExcludingZone({ parentId, searchText }) {
    try {
      const [results] = await this.sendQuery(searchAdventuresNotInZoneQuery, [
        `"${searchText}"`,
        parentId
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.searchText
   * @returns {Promise<Object[]>} a list of zones that match the search text
   */
  async zoneSearch({ searchText }) {
    try {
      const [results] = await this.sendQuery(searchZoneQuery, [
        `"${searchText}"`
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.parentId
   * @param {string} params.searchText
   * @returns {Promise<Object[]>} a list of zones that match the search text excluding any direct children of the parentId
   */
  async zoneSearchExcludingParent({ parentId, searchText }) {
    try {
      const [results] = await this.sendQuery(searchZonesNotInZoneQuery, [
        `"${searchText}"`,
        parentId,
        parentId
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }
}

module.exports = SearchDataLayer
