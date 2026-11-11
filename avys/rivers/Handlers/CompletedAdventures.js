const {
  sendResponse,
  returnError,
  CREATED,
  NOT_ACCEPTABLE
} = require('../ResponseHandling')
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
      rating,
      old_rating,
      old_difficulty
    } = req.body

    req.logger.info('completing an adventure')

    req.logger.info(
      JSON.stringify({
        user_id,
        adventure_id,
        adventure_type,
        rating,
        difficulty
      })
    )

    const { match, response } =
      await serviceHandler.adventureService.checkAdventureRatings({
        adventureId: adventure_id,
        difficulty: old_difficulty,
        rating: old_rating
      })

    if (!match) {
      throw returnError({ req, res, message: response, status: NOT_ACCEPTABLE })
    }

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
