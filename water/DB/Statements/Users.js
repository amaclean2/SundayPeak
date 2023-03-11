/**
 * I want all the users I am friends with
 * That means all the users I follow or the users that follow me
 * Select all the followers where leader_id is me
 * And all the users where follower_id is me
 */

const createUserStatement =
  'INSERT INTO users (email, first_name, last_name, password) VALUES(?, ?, ?, ?)'
const insertSearchableStatement =
  'REPLACE INTO searchable_users (searchable_text, user_id) VALUES (?, ?)'
const selectUserIdStatement = 'SELECT id FROM users WHERE email = ?'
const getUserWithEmailStatement =
  'SELECT first_name, last_name, email, bio, city, id, password, phone, user_site FROM users WHERE email = ?'
const getUserByIdStatement =
  'SELECT first_name, last_name, email, bio, city, id, password, phone, user_site FROM users WHERE id = ?'
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
    'UPDATE users SET profile_picture_url = ?, last_updated = NOW() WHERE id = ?'
}
const getSearchFields =
  'SELECT first_name, last_name, bio, email, city FROM users WHERE id = ?'
const findNewFriendStatement =
  "SELECT DISTINCT CONCAT(first_name, ' ', last_name) AS display_name, id, email, profile_picture_url FROM users AS u INNER JOIN searchable_users AS s ON s.user_id = u.id WHERE s.searchable_text LIKE ?"
const findFromFriendsStatement =
  "SELECT DISTINCT CONCAT(u.first_name, ' ', u.last_name) AS display_name, u.email, u.profile_picture_url, u.id AS id FROM users AS u INNER JOIN friends AS f ON (f.follower_id != ? AND f.follower_id = u.id) OR (f.leader_id != ? AND f.leader_id = u.id) INNER JOIN searchable_users AS su ON su.user_id = u.id WHERE su.searchable_text LIKE ?"
const deleteUserStatement = 'DELETE FROM users WHERE id = ?'
const deleteSearchableStatement = `DELETE FROM searchable_users WHERE user_id = ?`

module.exports = {
  createUserStatement,
  insertSearchableStatement,
  selectUserIdStatement,
  getUserWithEmailStatement,
  getUserByIdStatement,
  updateUserStatements,
  deleteUserStatement,
  findNewFriendStatement,
  findFromFriendsStatement,
  getSearchFields,
  deleteSearchableStatement
}
