const createStatements = require('./create')
const getterStatements = require('./getters')
const updateStatements = require('./updates')
const deleteStatements = require('./deletes')

module.exports = {
  ...createStatements,
  ...getterStatements,
  ...updateStatements,
  ...deleteStatements
}
