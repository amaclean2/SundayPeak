const sendMessage =
  'INSERT INTO messages (conversation_id, sender_id, message_text, data_reference) VALUES (?, ?, ?, ?)'

module.exports = {
  sendMessage
}
