const followUserStatement =
  'INSERT INTO followers (follower_id, leader_id, public) VALUES (?, ?, ?)'
const getFriendCredStatement =
  'SELECT email, first_name, last_name FROM users WHERE id = ?'
const getFriendsStatement = `SELECT l.first_name AS leader_first_name, l.last_name AS leader_last_name, l.id AS leader_id, l.email AS leader_email,
m.first_name AS follower_first_name, m.last_name AS follower_last_name, m.email AS follower_email, m.id AS follower_id FROM followers AS f
INNER JOIN users AS l ON f.leader_id = l.id INNER JOIN users AS m ON f.follower_id = m.id WHERE f.leader_id = ? OR f.follower_id = ?`
const getFriendsCountStatement =
  'SELECT COUNT(follower_id) FROM followers WHERE leader_id = ? OR follower_id = ?'
const getIsFriendStatement =
  'SELECT * FROM followers WHERE follower_id = ? AND leader_id = ?'

module.exports = {
  followUserStatement,
  getFriendCredStatement,
  getFriendsStatement,
  getFriendsCountStatement,
  getIsFriendStatement
}
