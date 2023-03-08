const logger = require('../Config/logger')

const failedInsertion = (error) => {
  logger.info('DATABASE_INSERTION_FAILED', error)
  throw error
}

const failedQuery = (error) => {
  logger.info('DATABASE_QUERY_FAILED', error)
  throw error
}

const failedUpdate = (error) => {
  logger.info('DATABASE_UPDATE_FAILED', error)
  throw error
}

const failedDeletion = (error) => {
  logger.info('DATABASE_DELETION_FAILED', error)
  throw error
}

module.exports = {
  failedInsertion,
  failedQuery,
  failedUpdate,
  failedDeletion
}
