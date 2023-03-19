const selectActivitiesByAdventureStatement =
  'SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, u.id AS user_id, ac.adventure_id FROM completed_adventures AS ac INNER JOIN users AS u ON ac.creator_id = u.id INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.adventure_id = ?'
const getCompletedAdventureByUserStatement =
  'SELECT ac.creator_id, a.adventure_name, a.adventure_type, a.nearest_city, a.id AS adventure_id FROM completed_adventures AS ac INNER JOIN users AS u ON ac.creator_id = u.id INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.creator_id = ?'
const getCompletedData =
  "SELECT CONCAT(u.first_name, ' ', u.last_name) AS display_name, u.email, u.profile_picture_url, u.id AS user_id, a.adventure_name, a.adventure_type, a.id AS adventure_id, a.nearest_city FROM completed_adventures AS c INNER JOIN users AS u ON c.creator_id = u.id INNER JOIN adventures AS a ON c.adventure_id = a.id WHERE c.creator_id = ? AND c.adventure_id = ?"
const createActivityStatement =
  'INSERT INTO completed_adventures (creator_id, adventure_id, public) VALUES (?, ?, ?)'
const getCompletedAdventureCountByUserStatement =
  'SELECT COUNT(adventure_id) FROM completed_adventures WHERE creator_id = ?'
const deleteActivityByUserStatement =
  'DELETE FROM completed_adventures WHERE creator_id = ?'
const deleteCompletedByAdventureStatement =
  'DELETE FROM completed_adventures WHERE adventure_id = ?'
const delteActivityStatement = 'DELETE FROM completed_adventures WHERE id = ?'

module.exports = {
  selectActivitiesByAdventureStatement,
  getCompletedAdventureByUserStatement,
  getCompletedData,
  createActivityStatement,
  getCompletedAdventureCountByUserStatement,
  deleteActivityByUserStatement,
  deleteCompletedByAdventureStatement,
  delteActivityStatement
}
