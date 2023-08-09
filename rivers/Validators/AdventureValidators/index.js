const { body } = require('express-validator')
const { adventureCreateValidator } = require('./AdventureCreateValidator')
const { adventureEditValidator } = require('./AdventureEditValidator')

const adventuresGetValidator = () => {
  return []
}

const adventureBulkInsertValidator = () => {
  return [
    body('adventures').custom((field) => {
      if (!field) {
        throw '"adventure" parameter required in body'
      }
    })
  ]
}

module.exports = {
  adventuresGetValidator,
  adventureEditValidator,
  adventureBulkInsertValidator,
  adventureCreateValidator
}
