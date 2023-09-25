const { sendResponse, returnError, CREATED } = require('../ResponseHandling')
const serviceHandler = require('../Config/services')
const { validationResult } = require('express-validator')

const completeAdventure = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return returnError({ req, res, error: errors.array()[0] })
    }

    const {
      user_id,
      adventure_id,
      adventure_type,
      public: publicField,
      difficulty,
      rating
    } = req.body

    const { userCompleted, adventureCompleted } =
      await serviceHandler.userService.completeAdventure({
        userId: user_id,
        adventureId: adventure_id,
        adventureType: adventure_type,
        isPublic: publicField,
        rating,
        difficulty
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
