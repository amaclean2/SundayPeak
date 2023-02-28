const userQueries = require('./User')
const adventureQueries = require('./DatabaseAdventures')
const tickQueries = require('./Tick')
const activityQueries = require('./Activity')
const pictureQueries = require('./Pictures')
const {
  getAllAccountsCountStatement,
  getAllAdventuresCountStatement
} = require('./Statements/General')
const { sendQuery } = require('../Config/db')
const logger = require('../Config/logger')

const statsQuery = async () => {
  try {
    const [userResults] = await sendQuery(getAllAccountsCountStatement)
    const [adventureResults] = await sendQuery(getAllAdventuresCountStatement)

    return {
      accounts: userResults[0]['COUNT(id)'],
      adventures: adventureResults[0]['COUNT(id)']
    }
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const queries = {
  ...userQueries,
  ...adventureQueries,
  ...tickQueries,
  ...activityQueries,
  ...pictureQueries,
  statsQuery
}

module.exports = queries
