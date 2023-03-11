const createNewMessageStatement =
  'INSERT INTO messages (conversation_id, sender_id, message_body, data_reference) VALUES (?, ?, ?, ?)'
const addLastMessageStatement =
  'UPDATE conversations SET last_message = ? WHERE conversation_id = ?'
const createNewConversationStatement =
  "INSERT INTO conversations (last_message) VALUES ('')"
const createNewInteractionsStatement =
  'INSERT INTO conversation_interactions (user_id, conversation_id, unread) VALUES ?'
const findConversationStatement =
  'SELECT ci.conversation_id, c.last_message, c.conversation_name FROM conversation_interactions AS ci INNER JOIN conversations AS c ON c.id = ci.conversation_id WHERE ci.user_id IN ? GROUP BY ci.conversation_id HAVING COUNT(ci.conversation_id) > 1 AND COUNT(ci.user_id) = ?'
const getUserConversationsStatement =
  "SELECT CONCAT(u.first_name, ' ', u.last_name) AS user_display_name, c.last_message, u.id AS user_id, u.profile_picture_url, ci.conversation_id, ci.unread FROM conversation_interactions AS ci INNER JOIN users AS u ON u.id = ci.user_id INNER JOIN conversations AS c ON c.id = ci.conversation_id WHERE conversation_id IN ( SELECT conversation_id FROM conversation_interactions WHERE user_id = ? )"
const setUnreadStatement =
  'UPDATE conversation_interactions SET unread = 1 WHERE conversation_id = ? AND user_id != ?'
const setLastMessageStatement =
  'UPDATE conversations SET last_message = ? WHERE id = ?'
const clearUnreadStatement =
  'UPDATE conversation_interactions SET unread = 0 WHERE user_id = ? AND conversation_id = ?'
const getConversationMessagesStatement =
  "SELECT CONCAT(u.first_name, ' ', u.last_name) AS display_name, message_body, data_reference, u.id AS user_id FROM messages AS m INNER JOIN users AS u ON m.sender_id = u.id WHERE m.conversation_id = ?"

module.exports = {
  createNewMessageStatement,
  addLastMessageStatement,
  createNewConversationStatement,
  createNewInteractionsStatement,
  getUserConversationsStatement,
  setUnreadStatement,
  setLastMessageStatement,
  clearUnreadStatement,
  getConversationMessagesStatement,
  findConversationStatement
}
