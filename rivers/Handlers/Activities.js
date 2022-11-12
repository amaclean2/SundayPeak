const { validationResult } = require('express-validator')
const queries = require('../DB')
const {
  sendResponse,
  SUCCESS,
  returnError,
  CREATED
} = require('../ResponseHandling')
const { buildUserObject } = require('../Services/user.service')

const getActivitiesByAdventure = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return returnError({ req, res, error: errors.array()[0] })
    }
    const { adventure_id } = req.body
    const activities = await queries.getActivitiesByAdventure({
      adventure_id
    })

    return sendResponse({
      req,
      res,
      status: SUCCESS,
      data: {
        activities: activities.map((activity) => ({
          ...activity,
          user_id: activity.creator_id
        }))
      }
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverGetActivities', error })
  }
}

const createActivity = async (req, res) => {
  try {
    const { user_id, adventure_id, public: publicField } = req.body

    await queries.deleteTick({ adventureId: adventure_id, userId: user_id })
    await queries.createActivity({ user_id, adventure_id, public: publicField })

    const newUserObj = await buildUserObject({
      req,
      res,
      initiation: { id: user_id }
    })
    delete newUserObj.password

    return sendResponse({
      req,
      res,
      status: CREATED,
      data: { user: newUserObj }
    })
  } catch (error) {
    return returnError({ req, res, message: 'serverCreateActivity', error })
  }
}

module.exports = {
  getActivitiesByAdventure,
  createActivity
}
