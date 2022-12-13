/**
 * I want all the users I am friends with
 * That means all the users I follow or the users that follow me
 * Select all the followers where leader_id is me
 * And all the users where follower_id is me
 */

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
const findNewFriendStatement = `SELECT * FROM users 
WHERE CONCAT(first_name, ' ', last_name) LIKE ? AND id != ?`
const findFromFriendsStatement = `SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, u.id AS user_id FROM users AS u
INNER JOIN followers AS f ON (f.follower_id != ? AND f.follower_id = u.id)
OR (f.leader_id != ? AND f.leader_id = u.id) WHERE CONCAT(u.first_name, ' ', u.last_name) LIKE ?`
const deleteUserStatement = 'DELETE FROM users WHERE id = ?'

module.exports = {
  createUserStatement,
  selectUserIdStatement,
  getUserWithEmailStatement,
  getUserByIdStatement,
  updateUserStatements,
  deleteUserStatement,
  findNewFriendStatement,
  findFromFriendsStatement
}
