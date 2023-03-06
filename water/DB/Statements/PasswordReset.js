const checkPasswordResetTokenStatement =
  'SELECT id FROM users WHERE id = ? AND password LIKE ?'
const updateNewPasswordStatement =
  'UPDATE users SET password = CASE WHEN password LIKE ? THEN ? ELSE users.password END WHERE id = ?'
const getPasswordHashStatement = 'SELECT password FROM users WHERE email = ?'

module.exports = {
  checkPasswordResetTokenStatement,
  updateNewPasswordStatement,
  getPasswordHashStatement
}
