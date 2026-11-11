const logger = require('../Config/logger')

const failedInsertion = async (error) => {
  logger.error('DATABASE_INSERTION_FAILED')
  logger.error(error)
  throw error
}

const failedQuery = async (error) => {
  logger.error('DATABASE_QUERY_FAILED')
  logger.error(error)
  throw error
}

const failedUpdate = async (error) => {
  logger.error('DATABASE_UPDATE_FAILED')
  logger.error(error)
  throw error
}

const failedDeletion = async (error) => {
  logger.info('DATABASE_DELETION_FAILED')
  logger.error(error)
  throw error
}

module.exports = {
  failedInsertion,
  failedQuery,
  failedUpdate,
  failedDeletion
}
