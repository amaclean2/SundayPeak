const apn = require('apn')
const logger = require('../../Config/logger')

/**
 * @param {Object} params
 * @param {string} params.senderName
 * @param {string} params.messageBody
 * @param {number[]} params.deviceTokens
 */
const createAPNNotification = ({
  senderName = 'Sunday Peak',
  messageBody,
  deviceTokens
}) => {
  const options = {
    token: {
      key: process.env.PATH_TO_APNS_SECRET_KEY ?? '',
      keyId: process.env.APNS_KEY_ID ?? '',
      teamId: process.env.APNS_TEAM_ID ?? ''
    },
    production: process.env.NODE_ENV === 'production'
  }

  const apnProvider = new apn.Provider(options)

  const note = new apn.Notification()

  note.expiry = 0
  note.alert = {
    title: senderName,
    body: messageBody
  }
  note.topic = 'com.sundaypeak.SundayPeak'

  apnProvider.send(note, deviceTokens).then((result) => {
    if (result.failed.length) {
      logger.info(JSON.stringify({ result: result.failed }))
    } else {
      logger.info(JSON.stringify({ result: result.sent }))
    }
  })
}

module.exports = {
  createAPNNotification
}
