const {
  sendResponse,
  returnError,
  CREATED,
  NOT_ACCEPTABLE,
  SUCCESS,
  NOT_FOUND
} = require('../ResponseHandling')
const serviceHandler = require('../Config/services')

const addConversation = async (req, res) => {
  try {
    if (
      !req.body.user_ids ||
      req.body.user_ids.length < 1 ||
      req.body.user_ids.includes(null) ||
      req.body.user_ids.includes(undefined) ||
      req.body.user_ids.includes('')
    ) {
      return returnError({
        req,
        res,
        status: NOT_ACCEPTABLE,
        message:
          'an array of user ids as numbers are required in the request body for a conversation to be created'
      })
    }

    const { id_from_token } = req.body
    const userIds = [id_from_token, ...req.body.user_ids]

    req.logger.info('Creating a new conversation')

    const response = await serviceHandler.messagingService.createConversation({
      userIds
    })

    return sendResponse({
      req,
      res,
      data: response.conversation_exists
        ? {
            conversation: {
              users: userIds.map((user_id) => ({ user_id })),
              ...response.conversation
            }
          }
        : {
            conversation: {
              users: userIds.map((user_id) => ({ user_id })),
              conversation_id: response.conversation_id,
              last_message: '',
              unread: false
            },
            senderId: id_from_token
          },
      status: CREATED
    })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'server error: could not create a conversation',
      error
    })
  }
}

const addUserToConversation = async (req, res) => {
  try {
    const { user_id, conversation_id } = req.body
    if (!(user_id && conversation_id)) {
      throw returnError({
        req,
        res,
        status: NOT_ACCEPTABLE,
        message: 'a user_id and conversation_id is required to add a user'
      })
    }

    req.logger.info(`Adding a user to a conversation ${conversation_id}`)

    await serviceHandler.messagingService.expandConversation({
      userId: user_id,
      conversationId: conversation_id
    })

    return sendResponse({
      req,
      res,
      data: { message: 'user added', user_id, conversation_id },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'server error: could not add user to conversation',
      error
    })
  }
}

const getConversations = async (req, res) => {
  try {
    const { id_from_token } = req.body

    req.logger.info('getting all conversations')

    const conversations =
      await serviceHandler.messagingService.getConversationsPerUser({
        userId: id_from_token
      })

    return sendResponse({ req, res, data: { conversations }, status: SUCCESS })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'server error: could not get conversations',
      error
    })
  }
}

const deleteConversation = async (req, res) => {
  try {
    req.logger.info('delete conversation not ready')
    throw returnError({
      req,
      res,
      message: 'endpoint not ready',
      status: NOT_FOUND
    })
  } catch (error) {
    return returnError({
      req,
      res,
      message: 'server error: could not delete conversation',
      error
    })
  }
}

module.exports = {
  getConversations,
  addConversation,
  deleteConversation,
  addUserToConversation
}
