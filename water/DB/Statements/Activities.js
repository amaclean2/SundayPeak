const selectActivitiesByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, u.id AS user_id, ac.adventure_id
FROM completed_adventures AS ac INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.adventure_id = ?`
const getCompletedAdventureByUserStatement = `SELECT ac.creator_id, a.adventure_name, a.adventure_type, a.nearest_city, a.id AS adventure_id
FROM completed_adventures AS ac INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.creator_id = ?`
const createActivityStatement =
  'INSERT INTO completed_adventures (creator_id, adventure_id, public) VALUES (?, ?, ?)'
const getCompletedAdventureCountByUserStatement =
  'SELECT COUNT(adventure_id) FROM completed_adventures WHERE creator_id = ?'
const deleteActivityByUserStatement =
  'DELETE FROM completed_adventures WHERE creator_id = ?'
const deleteActivityByAdventureStatement =
  'DELETE FROM completed_adventures WHERE adventure_id = ?'
const delteActivityStatement = 'DELETE FROM completed_adventures WHERE id = ?'

module.exports = {
  selectActivitiesByAdventureStatement,
  getCompletedAdventureByUserStatement,
  createActivityStatement,
  getCompletedAdventureCountByUserStatement,
  deleteActivityByUserStatement,
  deleteActivityByAdventureStatement,
  delteActivityStatement
}
