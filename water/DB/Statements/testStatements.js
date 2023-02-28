const deleteStatements = [
  'DELETE FROM user_images',
  'DELETE FROM activities',
  'DELETE FROM ticks',
  'DELETE FROM adventure_editors',
  'DELETE FROM followers',
  'DELETE FROM adventures',
  'DELETE FROM users'
]

const testCreateUserStatement =
  'INSERT INTO users (email, password, first_name, last_name) VALUES("user@email.com", ?, "Test", "User")'
const testCreateSecondUserStatement =
  'INSERT INTO users (email, password, first_name, last_name) VALUES("second@email.com", ?, "Second", "User")'
const getTestUserIdStatement =
  'SELECT id FROM users WHERE email = "user@email.com";'

module.exports = {
  deleteStatements,
  testCreateUserStatement,
  testCreateSecondUserStatement,
  getTestUserIdStatement
}
