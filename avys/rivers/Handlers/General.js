const {
  sendResponse,
  returnError,
  SERVER_ERROR,
  SUCCESS
} = require('../ResponseHandling')

const getAppStats = async (req, res) => {
  try {
    const stats = {}
    return sendResponse({
      req,
      res,
      data: {
        stats
      },
      status: SUCCESS
    })
  } catch (error) {
    return returnError({
      req,
      res,
      status: SERVER_ERROR,
      message: `som'tin didn't work`,
      error
    })
  }
}

module.exports = {
  getAppStats
}
