const Water = require('.')
const { failedUpdate } = require('../DB/utils')
const { hashPassword } = require('./utils/crypto')
const { handleEmailReset } = require('./utils/email')

class PasswordService extends Water {
  /**
   * @param {Object} params
   * @param {string} param.email | the email to send the password update message to
   * @param {PasswordEmailCallback} [testEmailCallback]
   * @returns {Promise<void>}
   */
  sendPasswordResetEmail({ email }, testEmailCallback) {
    return this.userDB.getPasswordResetToken({ email }).then((resetToken) => {
      if (resetToken) {
        resetToken = resetToken.split(':').pop()
        const callback = testEmailCallback || handleEmailReset

        return callback({ email, resetToken }).then(
          () => 'password reset email sent'
        )
      } else {
        return 'no account was found with that email'
      }
    })
  }

  /**
   * @param {Object} params
   * @param {number} params.userId | the user to update the password of
   * @param {string} params.newPassword | the new password to update
   * @param {string} params.resetToken | if this matches whats in the database then update the password
   * @returns {Promise<string>} | a message about the password being updated
   */
  saveNewPassword({ newPassword, userId, resetToken }) {
    return this.userDB
      .checkPasswordResetToken({ userId, token: resetToken })
      .then((validId) => validId?.id === userId)
      .then((matches) => {
        if (matches) {
          const newHashedPassword = hashPassword(newPassword)
          return this.userDB.replaceUserPassword({
            newHashedPassword,
            userId,
            resetToken
          })
        } else {
          throw 'your reset token is invalid'
        }
      })
      .then(() => 'password has been updated')
      .catch(failedUpdate)
  }
}

module.exports = PasswordService
