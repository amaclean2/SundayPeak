const Water = require('.')
const SearchService = require('./search.service')

class MessagingService extends Water {
  constructor(sendQuery, jwtSecret) {
    super(sendQuery, jwtSecret)
    this.search = new SearchService(sendQuery, jwtSecret)
  }

  /**
   * @param {Object} params
   * @param {number[]} params.userIds
   * @param {string} params.conversationName
   * @returns {Promise<NewConversationReturnType>} | an object containing the
   * conversationId and conversationName of the new conversation
   */
  createConversation({ userIds, conversationName }) {
    // create a new row in the conversations table
    // create new rows in the conversation_interactions table for each user in the conversation
    return this.messageDB.saveNewConversation({
      userIds,
      conversationName
    })
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {}
   */
  getConversationsPerUser({ userId }) {
    // look through the conversation_interactions table and find all the conversations for the current user
    return this.messageDB.getUserConversations({ userId })
  }

  /**
   * @param {Object} params
   * @param {number[]} users
   */
  getConversation({ conversationId, userId }) {
    let conversationMessages
    return this.messageDB
      .getMessagesPerConversation({ conversationId })
      .then((messages) => (conversationMessages = messages))
      .then(() =>
        this.messageDB.clearUnreadConversation({ userId, conversationId })
      )
      .then(() => conversationMessages)
    // look through the messages table and get all the messages with the provided conversationId
    // then update the unread variable for that user and conversation
  }

  /**
   * @param {Object} params
   * @param {number} params.conversationId
   * @param {number} params.senderId
   * @param {string} params.messageBody
   * @param {string} params.dataReference
   * @returns {Promise<MessageObject>} | an object containing all the relevant data about the message
   */
  sendMessage({ conversationId, senderId, messageBody, dataReference }) {
    // add a new message to the messages table
    let responseBody
    return this.messageDB
      .saveNewMessage({
        conversationId,
        senderId,
        messageBody,
        dataReference
      })
      .then(({ insertId }) => {
        responseBody = {
          body: messageBody,
          sender: senderId,
          id: insertId,
          conversation: conversationId,
          data: dataReference
        }
      })
      .then(() =>
        this.messageDB.updateUnread({ userId: senderId, conversationId })
      )
      .then(() => responseBody)
  }
}

module.exports = MessagingService
