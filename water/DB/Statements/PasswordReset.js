const checkPasswordResetTokenStatement =
  'SELECT id FROM users WHERE password = ?'
const updateNewPasswordStatement = 'UPDATE users SET password = ? WHERE id = ?'

module.exports = {
  checkPasswordResetTokenStatement,
  updateNewPasswordStatement
}
