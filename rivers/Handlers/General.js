const { statsQuery } = require('../DB')
const {
  sendResponse,
  returnError,
  SERVER_ERROR,
  SUCCESS
} = require('../ResponseHandling')

const getAppStats = async (req, res) => {
  try {
    const data = await statsQuery()
    return sendResponse({
      req,
      res,
      data: {
        stats: data
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
