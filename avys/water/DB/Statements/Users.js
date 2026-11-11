const createUserStatement =
  'INSERT INTO users (email, first_name, last_name, password, profile_picture_url) VALUES(?, ?, ?, ?, ?)'
const selectUserIdStatement = 'SELECT id FROM users WHERE email = ?'
const getUserWithEmailStatement =
  'SELECT first_name, last_name, email, bio, city, id, password, phone, user_site, profile_picture_url, email_opt_out FROM users WHERE email = ?'
const getUserByIdStatement =
  'SELECT first_name, last_name, email, bio, city, id, password, phone, user_site, profile_picture_url, email_opt_out FROM users WHERE id = ?'
const updateUserStatement = 'UPDATE `users` SET ?? = ? WHERE id = ?'
const deleteUserStatement = 'DELETE FROM users WHERE id = ?'
const optOutOfEmailStatement =
  'UPDATE users SET email_opt_out = 1 WHERE email = ?'

module.exports = {
  createUserStatement,
  selectUserIdStatement,
  getUserWithEmailStatement,
  getUserByIdStatement,
  updateUserStatement,
  deleteUserStatement,
  optOutOfEmailStatement
}
