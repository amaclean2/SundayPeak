const logger = require('./Config/logger.js')
const { parseMessage } = require('./Messages')
const { userValidation } = require('./Validation/index.js')

// [userId: websocket]
const connectedUsers = {}

// [conversationId: userId[]]
const activeConversations = {}

const verifyUser = ({ token }) => {
  if (!token) {
    throw { closeConnection: true, message: 'token required to verify user' }
  }

  return userValidation({ token }).catch((error) => {
    throw { closeConnection: true, message: `Invalid token ${error}` }
  })
}

const onConnection = (ws) => {
  logger.info('connected to new client')

  let currentUserId = null
  let jsonMessage = null

  ws.on('message', async (message) => {
    try {
      jsonMessage = JSON.parse(message)
    } catch (error) {
      logger.error(error)

      ws.send(
        JSON.stringify({
          error:
            'Message is not a JSON object. Please format your request as JSON.'
        })
      )
      return
    }

    const authTokenMsg =
      'The auth token provided on login is required in all messages'

    try {
      const result = await verifyUser({ token: jsonMessage.token })
      currentUserId = result?.idFromToken

      if (!result || !currentUserId)
        return ws.send(JSON.stringify({ error: authTokenMsg }))
    } catch (error) {
      if (
        error.message.includes('token required') ||
        error.message.includes('Invalid token')
      ) {
        logger.error(authTokenMsg)
        return ws.send(JSON.stringify({ error: authTokenMsg }))
      }
    }

    const localLogger = logger.child({ meta: { userId: currentUserId } })

    localLogger.info(`Message received: ${jsonMessage.type}`)

    const data = await parseMessage({
      message: jsonMessage,
      userId: currentUserId,
      logger: localLogger
    })

    localLogger.info(JSON.stringify({ result: Object.keys(data) }))

    switch (jsonMessage.type) {
      case 'verifyUser':
        // connect the user to the websocket and send a connected message
        const userObject = { ws }

        if (jsonMessage.deviceToken) {
          // save the device token
          userObject.deviceToken = jsonMessage.deviceToken
        }

        connectedUsers[currentUserId] = userObject

        ws.send(JSON.stringify(data))
        break
      case 'sendMessage':
        // send the message out to everyone in the conversation after it's been saved to the database
        // include in the message the new conversation object
        if (data.error) {
          ws.send(JSON.stringify(data))
          break
        } else if (activeConversations[data.message.conversation_id]) {
          localLogger.info(`Message from user: ${currentUserId}`)

          activeConversations[result.message.conversation_id].forEach(
            (userId) => {
              if (connectedUsers[userId]) {
                connectedUsers[userId].websocket.send(JSON.stringify(data))
              }

              localLogger.info(
                `Sent message to user ${userId} in conversation ${result.message.conversation_id}`
              )
            }
          )
        } else {
          activeConversations[data.message.conversation_id] = [currentUserId]

          ws.send(JSON.stringify(data))
        }
        break
      case 'createNewConversation':
        // a new conversation was added
        // send the new conversation to every connected user in the conversation
        // and add the conversation to the active conversations
        if (data.error) {
          ws.send(JSON.stringify(data))
          break
        } else if (data.conversation_exists === false) {
          const newConversation = data.conversations[0]
          activeConversations[newConversation.conversation_id] =
            newConversation.users.map(({ user_id }) => user_id)

          newConversation.users.forEach(({ user_id }) => {
            if (connectedUsers?.[user_id]) {
              connectedUsers[user_id].websocket.send(JSON.stringify(data))
            }
          })
        }

        ws.send(JSON.stringify(data))

        break
      case 'getConversation':
        // responding to a request for all the messages for a particular conversation
        ws.send(JSON.stringify(data))
        break
      case 'getAllConversations':
        // subscribe the user to each conversation once they are connected
        const userConversationKeys = Object.keys(data.conversations)

        userConversationKeys.forEach((conversationKey) => {
          if (activeConversations[conversationKey]) {
            activeConversations[conversationKey].push(currentUserId)
            const tempConversation = new Set(
              activeConversations[conversationKey]
            )
            activeConversations[conversationKey] = [...tempConversation]
          } else {
            activeConversations[conversationKey] = [currentUserId]
          }
        })

        ws.send(JSON.stringify(data))
        break
      case 'addUserToConversation':
        if (data.error) {
          ws.send(JSON.stringify(data))
          break
        }

        if (data.user_added) {
          // data.new_user conforms to `ShortUser`
          // to all the other users in the conversation, send the object for the new user
          activeConversations[data.conversationId]?.forEach((userId) => {
            if (connectedUsers[userId]) {
              connectedUsers[userId].websocket.send(
                JSON.stringify(data.newUser)
              )
            }
          })

          // add the new user to the conversation and send the new list of conversations to that user
          if (activeConversations[data.conversationId]) {
            activeConversations[data.conversationId].push(data.newUser.user_id)
          } else {
            activeConversations[data.conversationId] = [data.newUser.user_id]
          }

          if (connectedUsers[data.newUser.user_id]) {
            connectedUsers[data.newUser.user_id].websocket.send(
              JSON.stringify(data.newUserConversations)
            )
          }
        } else {
          ws.send(JSON.stringify(data))
        }
        break
      default:
        if (data.error) {
          localLogger.error(data.error.message ?? data.error)
          break
        }

        ws.send(JSON.stringify(data))
    }
  })

  ws.on('close', (code, reason) => {
    logger.info(`Connection closed: ${code} ${reason}`)
    delete connectedUsers[currentUserId]
  })
}

module.exports = {
  onConnection
}
