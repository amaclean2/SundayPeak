const DataLayer = require('..')
const {
  selectActivitiesByAdventureStatement,
  getCompletedAdventureByUserStatement,
  createActivityStatement,
  getCompletedData,
  getAdventureRatingAndDifficulty
} = require('../Statements')
const { failedQuery, failedInsertion } = require('../utils')

class CompletedAdventureDataLayer extends DataLayer {
  /**
   *
   * @param {Object} params
   * @param {number} params.adventureId
   * @returns {Promise} all the completed users for that adventure
   */
  getCompletedUsers({ adventureId }) {
    return this.sendQuery(selectActivitiesByAdventureStatement, [adventureId])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise} all the completed adventures for that user
   */
  getCompletedAdventures({ userId }) {
    return this.sendQuery(getCompletedAdventureByUserStatement, [userId])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @param {boolean} params.isPublic
   * @returns {Promise} the id of the new completion
   */
  completeAdventure({ adventureId, userId, isPublic }) {
    return this.sendQuery(createActivityStatement, [
      userId,
      adventureId,
      isPublic
    ])
      .then(() => this.sendQuery(getCompletedData, [userId, adventureId]))
      .then(([[results]]) => {
        const userCompletedObject = {
          adventure_name: results.adventure_name,
          adventure_type: results.adventure_type,
          adventure_id: results.adventure_id,
          nearest_city: results.nearest_city
        }

        const adventureCompletedObject = {
          display_name: results.display_name,
          email: results.email,
          profile_picture_url: results.profile_picture_url,
          user_id: results.user_id
        }

        return {
          userCompleted: userCompletedObject,
          adventureCompleted: adventureCompletedObject
        }
      })
      .catch(failedInsertion)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.adventureId
   * @returns {Promise} the rating, difficulty, adventure_id, and adventure_type of the adventure_id provided
   */
  getAdventureRatings({ adventureId }) {
    return this.sendQuery(getAdventureRatingAndDifficulty, [adventureId]).then(
      ([[adventureRatings]]) => {
        if (!adventureRatings) {
          throw 'no adventure found'
        } else {
          return adventureRatings
        }
      }
    )
  }
}

module.exports = CompletedAdventureDataLayer
