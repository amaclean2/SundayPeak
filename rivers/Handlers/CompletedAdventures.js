const { sendResponse, returnError, CREATED } = require('../ResponseHandling')
const serviceHandler = require('../Config/services')

const completeAdventure = async (req, res) => {
  try {
    const { user_id, adventure_id, public: publicField } = req.body

    const { userCompleted, adventureCompleted } =
      await serviceHandler.userService.completeAdventure({
        userId: user_id,
        adventureId: adventure_id,
        isPublic: publicField
      })

    return sendResponse({
      req,
      res,
      status: CREATED,
      data: {
        completed: {
          user_completed_field: userCompleted,
          adventure_completed_field: adventureCompleted
        }
      }
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverCreateActivity', error })
  }
}

module.exports = {
  completeAdventure
}
