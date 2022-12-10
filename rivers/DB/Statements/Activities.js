const selectActivitiesByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, u.id AS user_id, ac.adventure_id FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.adventure_id = ?`
const selectActivitiesByUserStatement = `SELECT ac.creator_id, a.adventure_name, a.adventure_type, a.nearest_city, a.id AS adventure_id FROM activities AS ac
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

module.exports = {
  selectActivitiesByAdventureStatement,
  selectActivitiesByUserStatement,
  createActivityStatement,
  countActivitiesStatement,
  deleteActivityByUserStatement,
  deleteActivityByAdventureStatement,
  delteActivityStatement
}
