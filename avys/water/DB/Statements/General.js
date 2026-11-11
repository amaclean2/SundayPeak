const useDatabase = 'USE friends'
const getAllAccountsCountStatement = 'SELECT COUNT(id) FROM users'
const getAllAdventuresCountStatement = 'SELECT COUNT(id) FROM adventures'

module.exports = {
  useDatabase,
  getAllAccountsCountStatement,
  getAllAdventuresCountStatement
}
