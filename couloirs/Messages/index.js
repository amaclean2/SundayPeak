const logger = require('../Config/logger.js')
const serviceHandler = require('../Config/services.js')
const { userValidation } = require('../Validation/index.js')

/**
 * @param {Object} message
 */
const parseMessage = async ({ message, userId = 0 }) => {
  message = JSON.parse(message)

  console.log({ message, userId })

  switch (message.type) {
    case 'getAllConversations':
      return getUserConversations({ userId })
    case 'getConversation':
      return getConversation({ conversationId: message.conversationId, userId })
    case 'verifyUser':
      if (!message.token)
        throw {
          closeConnection: true,
          message: 'token required for user verification'
        }
      return verifyUser({ token: message.token })
    case 'sendMessage':
      return sendMessage({
        userId,
        conversationId: message.conversationId,
        messageBody: message.messageBody
      })
    case 'createNewConversation':
      if (!message.userIds || !message.userIds.length) {
        throw {
          message: 'at least two users need to be added to a conversation'
        }
      }
      return createNewConversation({
        ...message,
        userIds: [...message.userIds, userId]
      })
    default:
      return 'no message type provided'
  }
}

const getConversation = ({ conversationId, userId }) => {
  return serviceHandler.messagingService
    .getConversation({
      conversationId,
      userId
    })
    .then((messages) => ({ messages }))
}

const getUserConversations = ({ userId }) => {
  return serviceHandler.messagingService
    .getConversationsPerUser({
      userId
    })
    .then((conversations) => ({
      conversations
    }))
}

const verifyUser = ({ token }) => {
  if (!token) throw 'token required to verify user'
  return userValidation({ token })
    .then((resp) => ({ userJoined: resp.idFromToken }))
    .catch((error) => {
      throw { closeConnection: true, message: `Invalid token ${error}` }
    })
}

const createNewConversation = ({ userIds, name = '' }) => {
  return serviceHandler.messagingService
    .createConversation({
      userIds,
      conversationName: name
    })
    .then((resp) => {
      return {
        conversation: {
          users: userIds.map((id) => ({
            user_id: id
          })),
          conversation_id: resp.conversationId,
          conversation_name: name,
          last_message: '',
          unread: false
        }
      }
    })
}

const sendMessage = ({ userId, conversationId, messageBody }) => {
  logger.info({ receivedMessage: { conversationId, userId, messageBody } })
  return serviceHandler.messagingService
    .sendMessage({
      conversationId,
      senderId: userId,
      messageBody
    })
    .then((message) => {
      logger.info({ message })
      return { message }
    })
}

module.exports = parseMessage
