const Water = require('.')
const logger = require('../Config/logger')
const { createAPNNotification } = require('./utils/notifications')

class MessagingService extends Water {
  constructor(sendQuery, jwtSecret) {
    super(sendQuery, jwtSecret)
  }

  /**
   * @param {Object} params
   * @param {number[]} params.userIds
   * @returns {Promise<NewConversationReturnType>} | an object containing the
   * conversationId of the new conversation
   */
  createConversation({ userIds }) {
    // create a new row in the conversations table
    // create new rows in the conversation_interactions table for each user in the conversation
    return this.messageDB.findConversation({ userIds }).then((conversation) => {
      if (conversation) {
        logger.info(
          `conversation found: conversation_${conversation.conversation_id}`
        )
        return {
          conversation_exists: true,
          conversation
        }
      } else {
        logger.info('creating a new conversation')
        return this.messageDB.saveNewConversation({
          userIds
        })
      }
    })
  }

  /**
   * @param {Object} params
   * @param {number} params.userId | the new user in the conversation
   * @param {number} params.conversationId | then conversation to be modified
   * @returns {Promise<void>} | if everything goes right, there shouldn't be anything to return
   */
  expandConversation({ userId, conversationId }) {
    return this.messageDB
      .addUserToConversation({ userId, conversationId })
      .then(logger.info)
      .catch((error) =>
        logger.error(`failed to add user to conversation: ${error}`)
      )
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @returns {Promise<ConversationResponseType>} | an object of conversations where the key
   * is the conversation id and the value is the conversation details
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
   * @param {string} params.senderName
   * @returns {Promise<{message_body: string, user_id: number, conversation_id: number, data_reference: string, applied_tokens: Array<string>}>} | an object containing all the relevant data about the message
   */
  async sendMessage({
    conversationId,
    senderId,
    messageBody,
    dataReference,
    senderName
  }) {
    // add a new message to the messages table
    try {
      if (!conversationId || !senderId || !messageBody) {
        throw 'conversationId, senderId and messageBody are required fields'
      }

      // save the message to the database
      await this.messageDB.saveNewMessage({
        conversationId,
        senderId,
        messageBody,
        dataReference
      })

      // set the unread notification status for the sending user
      await this.messageDB.updateUnread({
        userId: senderId,
        conversationId
      })

      // set the last message for the conversation
      await this.messageDB.setLastMessage({
        lastMessage: messageBody,
        conversationId
      })

      // get all connected device tokens in the conversation
      const tokens = await this.messageDB.getDeviceTokensPerConversation({
        conversationId
      })
      const formattedTokens = tokens
        .filter(({ user_id }) => user_id !== senderId)
        .map(({ token }) => token)

      // send a notification to all connected clients
      if (formattedTokens.length) {
        logger.info(JSON.stringify({ deviceTokens: formattedTokens }))

        logger.info('Sending notifications to connected device tokens')
        createAPNNotification({
          senderName,
          messageBody,
          deviceTokens: formattedTokens
        })
      }

      // return the formatted data
      return {
        message_body: messageBody,
        user_id: senderId,
        conversation_id: conversationId,
        data_reference: dataReference ?? null
      }
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.userId
   * @param {string} params.token
   * @returns {Promise<string>} | a success message
   */
  async saveDeviceToken({ userId, token }) {
    try {
      if (!userId || !token) {
        throw 'userId and token are required'
      }

      const success = await this.messageDB.addTokenDb({ userId, token })
      logger.info(success)
      return success
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  /**
   *
   */
  deleteConversation({}) {}
}

module.exports = MessagingService
