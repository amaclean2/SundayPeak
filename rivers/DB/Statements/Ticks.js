const selectTicksByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, u.profile_picture_url, u.id AS user_id FROM ticks AS t
INNER JOIN users AS u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.adventure_id = ?`
const selectTicksByUserStatement = `SELECT u.id AS user_id, a.adventure_name, a.adventure_type, a.id AS adventure_id, a.nearest_city FROM ticks AS t
INNER JOIN users AS u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.creator_id = ?`
const createTickStatement =
  'INSERT INTO ticks (creator_id, adventure_id, public) VALUES (?, ?, ?)'
const deleteTickByUserStatement = 'DELETE FROM ticks WHERE creator_id = ?'
const deleteTickByAdventureStatement =
  'DELETE FROM ticks WHERE adventure_id = ?'
const deleteTickStatement =
  'DELETE FROM ticks WHERE adventure_id = ? AND creator_id = ?'

module.exports = {
  selectTicksByAdventureStatement,
  selectTicksByUserStatement,
  createTickStatement,
  deleteTickByAdventureStatement,
  deleteTickByUserStatement,
  deleteTickStatement
}
