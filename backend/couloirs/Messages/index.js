const serviceHandler = require('../Config/services.js')

/**
 * @description parseMessage takes a parsed JSON object and sorts what type of message it is
 * it then acts on the specific message type
 * @param {Object} message
 */
const parseMessage = async ({ message, userId, logger }) => {
  let response = null

  switch (message.type) {
    case 'subscribeUser':
      if (!message.conversation_ids) {
        response = {
          error: 'Conversation_ids must be included to subscribe user'
        }
      } else {
        logger.info(
          JSON.stringify({ conversation_ids: message.conversation_ids })
        )
        response = { conversationIds: message.conversation_ids }
      }
      break
    case 'verifyUser':
      if (message.deviceToken) {
        // save the device token if one is provided
        // if the token is already in the database it'll ignore it
        logger.info('couloirs: saving device token')

        const successMessage =
          await serviceHandler.messagingService.saveDeviceToken({
            userId,
            token: message.deviceToken
          })
        logger.info(
          JSON.stringify({ deviceTokenSuccessMessage: successMessage })
        )
      }

      response = await Promise.resolve({ userJoined: true })
      break
    case 'sendMessage':
      if (!message.conversation_id) {
        response = await Promise.resolve({
          error:
            'Sending a message should include the properties conversation_id: String, message_body: String, sender_name: String'
        })
        break
      }

      response = await sendMessage({
        conversationId: message.conversation_id,
        messageBody: message.message_body ?? '',
        userId,
        senderName: message.sender_name ?? '',
        logger
      })
      break
    case 'subscribeUsersToNewConversation':
      if (
        !message.user_ids?.length ||
        message.user_ids.includes(null) ||
        message.user_ids.includes(undefined)
      ) {
        response = {
          error:
            'At least two user_ids need to be included in the message including the current user'
        }
        break
      }

      if (!message.conversation_id) {
        response = { error: 'A conversation_id is required in the message' }
        break
      }

      response = {
        conversationId: message.conversation_id,
        userIds: [...message.user_ids]
      }
      break
    case 'addUserToConversation':
      if (!message.new_user || !message.conversation_id) {
        logger.error(
          'the new_user and a conversation_id need to be specified to add the user to the conversation'
        )

        response = await Promise.resolve({
          error:
            'the new_user and a conversation_id need to be specified to add the user to the conversation'
        })
        break
      }

      response = {
        newUser: message.new_user,
        conversationId: message.conversation_id
      }

      break
    default:
      response = await Promise.resolve({
        error: `no message type provided. Message type must be one of type "getAllConversations", "getConversation", "verifyUser", "sendMessage", "createNewConversation", "addUserToConversation"`
      })
      break
  }
  return { ...response, request: message.type }
}

const sendMessage = async ({
  userId: senderId,
  conversationId,
  messageBody,
  senderName,
  logger
}) => {
  try {
    logger.info(
      JSON.stringify({ receivedMessage: { conversationId, senderId } })
    )

    const message = await serviceHandler.messagingService.sendMessage({
      conversationId,
      senderId,
      senderName,
      messageBody
    })

    return { message }
  } catch (error) {
    logger.error(error)
    return Promise.resolve({ error: 'Could not send message' })
  }
}

module.exports = {
  parseMessage
}
