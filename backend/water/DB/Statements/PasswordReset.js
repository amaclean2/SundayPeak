const checkPasswordResetTokenStatement =
  'SELECT id FROM users WHERE password LIKE ?'
const updateNewPasswordStatement = 'UPDATE users SET password = ? WHERE id = ?'
const getPasswordHashStatement = 'SELECT password FROM users WHERE email = ?'

module.exports = {
  checkPasswordResetTokenStatement,
  updateNewPasswordStatement,
  getPasswordHashStatement
}
