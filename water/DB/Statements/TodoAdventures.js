const selectTicksByAdventureStatement =
  "SELECT CONCAT(u.first_name, ' ', u.last_name) AS display_name, u.email, u.profile_picture_url, u.id AS user_id FROM todo_adventures AS t INNER JOIN users AS u ON t.creator_id = u.id INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.adventure_id = ?"
const selectTodoAdventuresByUserStatement =
  'SELECT u.id AS user_id, a.adventure_name, a.adventure_type, a.id AS adventure_id, a.nearest_city FROM todo_adventures AS t INNER JOIN users AS u ON t.creator_id = u.id INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.creator_id = ?'
const getTodoData =
  "SELECT CONCAT(u.first_name, ' ', u.last_name) AS display_name, u.email, u.profile_picture_url, u.id AS user_id, a.adventure_name, a.adventure_type, a.id AS adventure_id, a.nearest_city FROM todo_adventures AS t INNER JOIN users AS u ON t.creator_id = u.id INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.creator_id = ? AND t.adventure_id = ?"
const createTickStatement =
  'INSERT INTO todo_adventures (creator_id, adventure_id, public) VALUES (?, ?, ?)'
const deleteTickByUserStatement =
  'DELETE FROM todo_adventures WHERE creator_id = ?'
const deleteTodosByAdventureStatement =
  'DELETE FROM todo_adventures WHERE adventure_id = ?'
const deleteTickStatement =
  'DELETE FROM todo_adventures WHERE adventure_id = ? AND creator_id = ?'

module.exports = {
  selectTicksByAdventureStatement,
  selectTodoAdventuresByUserStatement,
  createTickStatement,
  getTodoData,
  deleteTodosByAdventureStatement,
  deleteTickByUserStatement,
  deleteTickStatement
}
