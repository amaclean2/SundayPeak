const DataLayer = require('..')
const {
  createNewMessageStatement,
  createNewConversationStatement,
  createNewInteractionsStatement,
  getUserConversationsStatement,
  setUnreadStatement,
  getConversationMessagesStatement,
  clearUnreadStatement,
  findConversationStatement,
  setLastMessageStatement
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
   * @param {number[]} params.userIds
   * @returns {Promise<NewConversationReturnType>} | an object containing the
   * conversationId of the new conversation
   */
  saveNewConversation({ userIds }) {
    let scopedId
    return this.sendQuery(createNewConversationStatement)
      .then(([{ insertId: conversationId }]) => {
        scopedId = conversationId
        return this.sendQuery(createNewInteractionsStatement, [
          userIds.map((userId) => [userId, conversationId, false])
        ])
      })
      .then(() => ({ conversationId: scopedId }))
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
  getUserConversations({ userId }) {
    return this.sendQuery(getUserConversationsStatement, [userId, userId])
      .then(([results]) => {
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
      })
      .catch(failedQuery)
  }

  getMessagesPerConversation({ conversationId }) {
    return this.sendQuery(getConversationMessagesStatement, [conversationId])
      .then(([results]) => results)
      .catch(failedQuery)
  }
}

module.exports = MessageDataLayer
