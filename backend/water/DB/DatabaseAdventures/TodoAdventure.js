const DataLayer = require('..')
const {
  selectTicksByAdventureStatement,
  createTickStatement,
  deleteTickStatement,
  selectTodoAdventuresByUserStatement,
  getTodoData
} = require('../Statements')
const { failedQuery, failedInsertion, failedDeletion } = require('../utils')

class TodoAdventureDataLayer extends DataLayer {
  /**
   *
   * @param {Object} params
   * @param {number} params.adventureId
   * @returns {Promise<AdventureTodo[]>}
   */
  getAdventureTodoList({ adventureId }) {
    return this.sendQuery(selectTicksByAdventureStatement, [adventureId])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise<UserTodo[]>}
   */
  getTodoAdventuresByUser({ userId }) {
    return this.sendQuery(selectTodoAdventuresByUserStatement, [userId])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @param {boolean} params.isPublic
   * @returns {Promise} the id of a new a todo item
   */
  createNewTodoAdventure({ adventureId, userId, isPublic }) {
    return this.sendQuery(createTickStatement, [userId, adventureId, isPublic])
      .then(() => this.sendQuery(getTodoData, [userId, adventureId]))
      .then(([[results]]) => {
        const userTodoObject = {
          adventure_name: results.adventure_name,
          adventure_type: results.adventure_type,
          adventure_id: results.adventure_id,
          nearest_city: results.nearest_city
        }

        const adventureTodoObject = {
          display_name: results.display_name,
          email: results.email,
          profile_picture_url: results.profile_picture_url,
          user_id: results.user_id
        }

        return { userTodo: userTodoObject, adventureTodo: adventureTodoObject }
      })
      .catch(failedInsertion)
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @return {Promise} void
   */
  removeTodoAdventure({ adventureId, userId }) {
    return this.sendQuery(deleteTickStatement, [adventureId, userId]).catch(
      failedDeletion
    )
  }
}

module.exports = TodoAdventureDataLayer
