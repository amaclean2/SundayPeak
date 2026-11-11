const serviceHandler = require('../Config/services.js')

/**
 * @description parseMessage takes a parsed JSON object and sorts what type of message it is
 * it then acts on the specific message type
 * @param {Object} message
 */
const parseMessage = async ({ message, userId, logger }) => {
  let response = null

  switch (message.type) {
    case 'getAllConversations':
      response = await getUserConversations({ userId, logger })
      break
    case 'getConversation':
      if (!message.conversation_id) {
        response = await Promise.resolve({
          error:
            'A non-zero conversation_id needs to be included when requesting a conversation'
        })
        break
      }

      response = await getConversation({
        conversationId: message.conversation_id,
        userId,
        logger
      })
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
    case 'createNewConversation':
      if (
        !message.user_ids?.length ||
        message.user_ids.includes(null) ||
        message.user_ids.includes(undefined) ||
        message.user_ids.includes(userId)
      ) {
        response = await Promise.resolve({
          error:
            "At least one additional user needs to be added to the conversation in the block user_ids: [number]. Don't add the current user."
        })
        break
      }

      logger.info(JSON.stringify({ userIds: [...message.user_ids, userId] }))

      response = await createNewConversation({
        userIds: [...message.user_ids, userId],
        logger
      })
      break
    case 'addUserToConversation':
      if (!message.user_id || !message.conversation_id) {
        logger.error(
          'a user_id and a conversation_id need to be specified to add the user to the conversation'
        )

        response = await Promise.resolve({
          error:
            'a user_id and a conversation_id need to be specified to add the user to the conversation'
        })
        break
      }

      response = await addNewUserToConversation({
        userId: message.user_id,
        conversationId: message.conversation_id,
        logger
      })
      break
    default:
      response = await Promise.resolve({
        error: `no message type provided. Message type must be one of type "getAllConversations", "getConversation", "verifyUser", "sendMessage", "createNewConversation", "addUserToConversation"`
      })
      break
  }
  return { ...response, request: message.type }
}

const getConversation = async ({ conversationId, userId, logger }) => {
  try {
    const messages = await serviceHandler.messagingService.getConversation({
      conversationId,
      userId
    })
    return { messages }
  } catch (error) {
    logger.error(error)
    return Promise.resolve({
      error: `No conversation found for id ${conversationId}`
    })
  }
}

const getUserConversations = async ({ userId, logger }) => {
  try {
    const conversations =
      await serviceHandler.messagingService.getConversationsPerUser({ userId })
    return { conversations }
  } catch (error) {
    logger.error(error)
    return Promise.resolve({
      error: `Conversations not found for user ${userId}`
    })
  }
}

const addNewUserToConversation = async ({ userId, conversationId, logger }) => {
  try {
    logger.info(`Adding new user to conversation ${conversationId}`)
    const { newUserConversations, newUser } =
      await serviceHandler.messagingService.expandConversation({
        userId,
        conversationId
      })

    logger.info(
      JSON.stringify({
        newUserToConversation: true,
        userId,
        conversationId
      })
    )

    return {
      user_added: true,
      newUser,
      conversationId,
      newUserConversations
    }
  } catch (error) {
    logger.error(error)
    return { user_added: false, error: error.message ?? error }
  }
}

const createNewConversation = async ({ userIds, logger }) => {
  try {
    const { conversation_exists, conversations } =
      await serviceHandler.messagingService.createConversation({
        userIds
      })

    logger.info(JSON.stringify({ conversation_exists, conversations }))

    return { conversations, conversation_exists }
  } catch (error) {
    logger.eror(error)
    return Promise.resolve({ error: 'could not create a new conversation' })
  }
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
