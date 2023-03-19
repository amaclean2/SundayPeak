import { WebSocketServer } from 'ws'
import logger from './Config/logger.js'
import { parseMessage } from './Messages/index.js'

const wss = new WebSocketServer({ port: 4000 })

const connectedUsers = new Set()
// activeConversations are all the conversations currently happening
const activeConversations = {}

wss.on('connection', (ws) => {
  let user
  let userConversations
  ws.on('message', (message) => {
    parseMessage({ message, userId: user?.userId })
      .then((result) => {
        logger.info({ result })
        if (result?.userJoined) {
          // connect the user to the websocket and send a connected message
          user = {
            ws,
            userId: result.userJoined
          }
          connectedUsers.add(user)
          ws.send(
            JSON.stringify({
              connected: true,
              message: `user ${result.userJoined} connected`
            })
          )
        } else if (result.message) {
          // send the message out to everyone in the conversation after it's been saved
          // to the database
          // include in the message the new conversation object
          activeConversations[result.message.conversation_id].forEach(
            (user) => {
              user.ws.send(JSON.stringify(result))
            }
          )
        } else if (result.conversation) {
          // a new conversation was added
          // send the new conversation to every connected user in the conversation
          ws.send(JSON.stringify(result))
        } else if (result.messages) {
          // responding to a request for all the messages for a particular conversation
          ws.send(JSON.stringify(result))
        } else if (result.conversations) {
          // subscribe the user to each conversation once they are connected
          const userConversationKeys = Object.keys(result.conversations)

          userConversationKeys.forEach((convo) => {
            if (activeConversations[convo]) {
              activeConversations[convo].add(user)
            } else {
              activeConversations[convo] = new Set()
              activeConversations[convo].add(user)
            }
          })
          ws.send(JSON.stringify(result))
        } else {
          // forward the handled response
          ws.send(JSON.stringify(result))
        }
      })
      .catch((error) => {
        logger.error(error)
        if (error.closeConnection) {
          connectedUsers.delete(user)
          ws.close(1011, 'An invalid token or no token was provided')
        }
      })
  })

  ws.on('close', () => (code, reason) => {
    logger.info(`Connection closed: ${code} ${reason}`)
    connectedUsers.delete(user)
    userConversations.forEach((convo) =>
      activeConversations[convo].delete(user)
    )
  })
})
