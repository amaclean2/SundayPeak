// users
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

// adventures
const createNewAdventureStatement = `INSERT INTO adventures (
adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat, coordinates_lng) VALUES (
?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const selectAdventureByIdStatement = 'SELECT * FROM adventures WHERE id = ?'
const selectAdventuresInRangeStatement = `SELECT * FROM adventures WHERE
coordinates_lat <= ? AND coordinates_lat >= ?
AND coordinates_lng >= ? and coordinates_lng <= ?
AND adventure_type = ?`
const updateAdventureStatements = {
  adventure_name: 'UPDATE adventures SET adventure_name = ? WHERE id = ?',
  aspect: 'UPDATE adventures SET aspect = ? WHERE id = ?',
  approach_time: 'UPDATE adventures SET approach_time = ? WHERE id = ?',
  exposure: 'UPDATE adventures SET exposure = ? WHERE id = ?',
  approach_distance: 'UPDATE adventures SET approach_distance = ? WHERE id = ?',
  season: 'UPDATE adventures SET season = ? WHERE id = ?',
  avg_angle: 'UPDATE adventures SET adventure_name = ? WHERE id = ?',
  max_angle: 'UPDATE adventures SET max_angle = ? WHERE id = ?',
  difficulty: 'UPDATE adventures SET difficulty = ? WHERE id = ?',
  elevation: 'UPDATE adventures SET elevation = ? WHERE id = ?',
  gear: 'UPDATE adventures SET gear = ? WHERE id = ?',
  gain: 'UPDATE adventures SET gain = ? WHERE id = ?',
  bio: 'UPDATE adventures SET bio = ? WHERE id = ?',
  nearest_city: 'UPDATE adventures SET nearest_city = ? WHERE id = ?',
  public: 'UPDATE adventures SET public = ? WHERE id = ?'
}
const deleteAdventureStatement = 'DELETE FROM adventures WHERE id = ?'

// ticks
const selectTicksByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, t.creator_id FROM ticks AS t
INNER JOIN users AS u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.adventure_id = ?`
const selectTicksByUserStatement = `SELECT t.creator_id, a.adventure_name, a.adventure_type, t.adventure_id, a.difficulty, a.nearest_city FROM ticks AS t
INNER JOIN users as u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.creator_id = ?`
const createTickStatement =
  'INSERT INTO ticks (creator_id, adventure_id, public) VALUES (?, ?, ?)'
const deleteTickByUserStatement = 'DELETE FROM ticks WHERE creator_id = ?'
const deleteTickByAdventureStatement =
  'DELETE FROM ticks WHERE adventure_id = ?'
const deleteTickStatement =
  'DELETE FROM ticks WHERE adventure_id = ? AND creator_id = ?'

// activities
const selectActivitiesByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, ac.creator_id, ac.adventure_id FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.adventure_id = ?`
const selectActivitiesByUserStatement = `SELECT ac.creator_id, a.adventure_name, a.adventure_type, a.difficulty, a.nearest_city, ac.adventure_id FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.creator_id = ?`
const createActivityStatement =
  'INSERT INTO activities (creator_id, adventure_id, public) VALUES (?, ?, ?)'
const countActivitiesStatement =
  'SELECT COUNT(adventure_id) FROM activities WHERE creator_id = ?'
const deleteActivityByUserStatement =
  'DELETE FROM activities WHERE creator_id = ?'
const deleteActivityByAdventureStatement =
  'DELETE FROM activities WHERE adventure_id = ?'
const delteActivityStatement = 'DELETE FROM activities WHERE id = ?'

// password_reset
const checkPasswordResetTokenStatement =
  'SELECT id FROM users WHERE password = ?'
const updateNewPasswordStatement = 'UPDATE users SET password = ? WHERE id = ?'

// followers
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

// pictures
const createUserPictureStatement =
  'INSERT INTO user_images (file_name, creator_id, public) VALUES (?, ?, 0)'
const createAdventurePictureStatement =
  'INSERT INTO user_images (file_name, creator_id, adventure_id, public) VALUES (?, ?, ?, 0)'
const getAdventurePicturesStatement =
  'SELECT file_name FROM user_images WHERE adventure_id = ?'
const getUserPicturesStatement =
  'SELECT file_name FROM user_images WHERE creator_id = ?'
const deletePictureStatement = 'DELETE FROM user_images WHERE file_name = ?'
const deleteProfilePictureStatement =
  'UPDATE users SET profile_picture_url = "", last_updated = NOW() WHERE id = ?'
const deletePictureByAdventureStatement =
  'DELETE FROM user_images WHERE file_name = ?'

module.exports = {
  createUserStatement,
  selectUserIdStatement,
  getUserWithEmailStatement,
  getUserByIdStatement,
  updateUserStatements,
  deleteUserStatement,
  createNewAdventureStatement,
  selectAdventureByIdStatement,
  selectAdventuresInRangeStatement,
  updateAdventureStatements,
  deleteAdventureStatement,
  selectTicksByAdventureStatement,
  selectTicksByUserStatement,
  createTickStatement,
  deleteTickByUserStatement,
  deleteTickByAdventureStatement,
  deleteTickStatement,
  selectActivitiesByAdventureStatement,
  selectActivitiesByUserStatement,
  createActivityStatement,
  countActivitiesStatement,
  deleteActivityByUserStatement,
  getFriendCredStatement,
  deleteActivityByAdventureStatement,
  delteActivityStatement,
  checkPasswordResetTokenStatement,
  updateNewPasswordStatement,
  followUserStatement,
  getFriendsStatement,
  getFriendsCountStatement,
  getIsFriendStatement,
  createUserPictureStatement,
  createAdventurePictureStatement,
  getAdventurePicturesStatement,
  getUserPicturesStatement,
  deletePictureStatement,
  deleteProfilePictureStatement,
  deletePictureByAdventureStatement
}
