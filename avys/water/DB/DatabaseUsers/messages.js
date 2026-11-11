const DataLayer = require('..')
const logger = require('../../Config/logger')
const {
  createNewMessageStatement,
  createNewConversationStatement,
  createNewInteractionsStatement,
  getUserConversationsStatement,
  setUnreadStatement,
  getConversationMessagesStatement,
  clearUnreadStatement,
  findConversationStatement,
  setLastMessageStatement,
  insertDeviceTokenStatement,
  selectDeviceTokenStatement
} = require('../Statements/Messages')
const { failedInsertion, failedQuery, failedUpdate } = require('../utils')

class MessageDataLayer extends DataLayer {
  /**
   * @param {Object} params
   * @param {number} params.conversationId
   * @param {number} params.senderId
   * @param {string} params.messageBody
   * @param {string} [params.dataReference] | an optional reference to a url
   * of any file to be included in the message
   * @returns {Promise<Object>} | an object containing the new id of
   * the message as insertId
   */
  saveNewMessage({
    conversationId,
    senderId,
    messageBody,
    dataReference = ''
  }) {
    return this.sendQuery(createNewMessageStatement, [
      conversationId,
      senderId,
      messageBody,
      dataReference
    ])
      .then(([{ insertId }]) => ({ insertId }))
      .catch(failedInsertion)
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.conversationId
   * @returns {Promise<void>}
   */
  updateUnread({ userId, conversationId }) {
    return this.sendQuery(setUnreadStatement, [conversationId, userId]).catch(
      failedUpdate
    )
  }

  /**
   * @param {Object} params
   * @param {string} params.lastMessage
   * @param {number} params.conversationId
   * @returns {Promise<void>}
   */
  setLastMessage({ lastMessage, conversationId }) {
    return this.sendQuery(setLastMessageStatement, [
      lastMessage,
      conversationId
    ]).catch(failedUpdate)
  }

  clearUnreadConversation({ userId, conversationId }) {
    return this.sendQuery(clearUnreadStatement, [userId, conversationId]).catch(
      failedUpdate
    )
  }

  /**
   * @param {Object} params
   * @param {number[]} params.userIds | all the users in the conversation
   * @returns {Promise<NewConversationReturnType>} | an object containing the
   * conversationId of the new conversation
   */
  async saveNewConversation({ userIds }) {
    try {
      // create a new conversation with last_message property = ''
      const [{ insertId: conversationId }] = await this.sendQuery(
        createNewConversationStatement
      )
      // take the conversation id created above and add it to each user to create conversation_interactions
      // with user_id and conversation_id
      await this.sendQuery(createNewInteractionsStatement, [
        userIds.map((userId) => [userId, conversationId, false])
      ])
      return { conversation_id: conversationId }
    } catch (error) {
      failedInsertion(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.userId | the new user in the conversation
   * @param {number} params.conversationId | then conversation to be modified
   * @returns {Promise<string>} | a string saying the user was added
   */
  addUserToConversation({ userId, conversationId }) {
    if (typeof userId === 'number' && typeof conversationId === 'number') {
      logger.info('received userId and conversationId from api')
    }

    return this.sendQuery(createNewInteractionsStatement, [
      [[userId, conversationId, true]]
    ])
      .then(() => 'user added to conversation')
      .catch(failedInsertion)
  }

  /**
   * @param {Object} params
   * @param {number[]} params.userIds
   * @returns {Promise<number|boolean>} | the conversation_id if the two users are in a conversation otherwise false
   */
  findConversation({ userIds }) {
    return this.sendQuery(findConversationStatement, [
      [userIds],
      [userIds],
      userIds.length
    ])
      .then(([results]) => (results.length ? results[0] : false))
      .catch(failedQuery)
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise<ConversationResponseType[]>} | an object with the key being the
   * conversation_id and the value being a conversation object
   */
  async getUserConversations({ userId }) {
    try {
      const [results] = await this.sendQuery(getUserConversationsStatement, [
        userId,
        userId
      ])
      const conversations = {}
      results.forEach((result) => {
        if (conversations[result.conversation_id]) {
          conversations[result.conversation_id].users = [
            ...conversations[result.conversation_id].users,
            {
              display_name: result.user_display_name,
              user_id: result.user_id,
              profile_picture_url: result.profile_picture_url
            }
          ]

          if (result.user_id === userId) {
            conversations[result.conversation_id].unread = !!result.unread
          }
        } else {
          conversations[result.conversation_id] = {
            users: [
              {
                display_name: result.user_display_name,
                user_id: result.user_id,
                profile_picture_url: result.profile_picture_url
              }
            ],
            conversation_id: result.conversation_id,
            last_message: result.last_message,
            ...(result.user_id === userId && { unread: !!result.unread })
          }
        }
      })

      return conversations
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.conversationId
   * @returns {Promise<MessageResponse[]>}
   */
  getMessagesPerConversation({ conversationId }) {
    return this.sendQuery(getConversationMessagesStatement, [conversationId])
      .then(([results]) => results)
      .catch(failedQuery)
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {string} param.token
   * @returns
   */
  async addTokenDb({ userId, token }) {
    try {
      await this.sendQuery(insertDeviceTokenStatement, [token, userId])

      return `token added or found succesfully for ${userId}`
    } catch (error) {
      throw failedInsertion(error)
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.conversationId
   * @returns {Promise<Array<{token: string}>>}
   */
  async getDeviceTokensPerConversation({ conversationId }) {
    try {
      const [results] = await this.sendQuery(selectDeviceTokenStatement, [
        conversationId
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }
}

module.exports = MessageDataLayer
