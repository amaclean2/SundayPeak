const createUserStatement =
  'INSERT INTO users (email, password, first_name, last_name, map_style) VALUES(?, ?, ?, ?, ?)'
const selectUserIdStatement = 'SELECT id FROM users WHERE email = ?'
const getUserWithEmailStatement = 'SELECT * FROM users WHERE email = ?'
const getUserByIdStatement = 'SELECT * FROM users WHERE id = ?'
const updateUserStatements = {
  first_name:
    'UPDATE users SET first_name = ?, last_updated = NOW() WHERE id = ?',
  last_name:
    'UPDATE users SET last_name = ?, last_updated = NOW() WHERE id = ?',
  email: 'UPDATE users SET email = ?, last_updated = NOW() WHERE id = ?',
  phone: 'UPDATE users SET phone = ?, last_updated = NOW() WHERE id = ?',
  is_premiun:
    'UPDATE users SET is_premium = ?, last_updated = NOW() WHERE id = ?',
  sex: 'UPDATE users SET sex = ?, last_updated = NOW() WHERE id = ?',
  user_site:
    'UPDATE users SET user_site = ?, last_updated = NOW() WHERE id = ?',
  password:
    'UPDATE users SET first_name = ?, last_updated = NOW() WHERE id = ?',
  city: 'UPDATE users SET city = ?, last_updated = NOW() WHERE id = ?',
  bio: 'UPDATE users SET bio = ?, last_updated = NOW() WHERE id = ?',
  profile_picture_url:
    'UPDATE users SET profile_picture_url = ?, last_updated = NOW() WHERE id = ?',
  map_style: 'UPDATE users SET map_style = ?, last_updated = NOW() WHERE id = ?'
}
const deleteUserStatement = 'DELETE FROM users WHERE id = ?'

module.exports = {
  createUserStatement,
  selectUserIdStatement,
  getUserWithEmailStatement,
  getUserByIdStatement,
  updateUserStatements,
  deleteUserStatement
}
