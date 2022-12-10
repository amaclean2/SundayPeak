const logger = require('../Config/logger')
const errorTexts = require('./ResponseText/errors')
const { SERVER_ERROR } = require('./statuses')

const statuses = require('./statuses')
const success = require('./success')

const returnError = ({
  req,
  res,
  status: statusCode,
  message = 'Error',
  error
}) => {
  if (error?.handled) {
    return null
  }

  let errorData
  let messageText
  let messageCode

  if (error?.msg) {
    errorData = errorTexts[error.msg]
    messageText = errorData?.messageText
    messageCode = errorData?.status
  } else {
    errorData = errorTexts[message]
    messageText = errorData?.messageText || message
    messageCode = errorData?.status || statusCode
  }

  const errorBody = {
    message: messageText,
    handled: true
  }

  if (req?.body) {
    errorBody.request_body = req.body
  }

  const returnStatus = messageCode ? messageCode : SERVER_ERROR

  errorBody.code_error = error

  logger.error(messageText)
  logger.error(error)

  res.status(messageCode ? messageCode : SERVER_ERROR).json({
    error: errorBody,
    statusCode: returnStatus
  })

  return errorBody
}

module.exports = {
  returnError,
  ...statuses,
  ...success
}
