const { sendQuery } = require('../Config/db')
const logger = require('../Config/logger')
const { sendMessage } = require('./Statements/Messages')

/**
 *
 * @param {Object} messageQueryValues | object containing values to use in the query
 * @param {int} messageQueryValues.conversationId | id of the conversation to attach the message to
 * @param {int} messageQueryValues.senderId | id of the sender sending the message
 * @param {string} messageQueryValues.messageBody | the actual message body
 * @param {string} messageQueryValues.dataReference | a reference to any data in the message
 * @returns a promise returning the response of adding the message to the database
 */
const addMessageToDatabase = (messageQueryValues) =>
  sendQuery(sendMessage, messageQueryValues).catch((error) => {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  })

module.exports = {
  addMessageToDatabase
}
