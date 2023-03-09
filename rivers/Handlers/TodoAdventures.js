const { validationResult } = require('express-validator')
const serviceHandler = require('../Config/services')
const { returnError, sendResponse, CREATED } = require('../ResponseHandling')

const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return returnError({ req, res, error: errors.array()[0] })
    }
    const { user_id, adventure_id, public: publicField } = req.body
    const { userTodo, adventureTodo } =
      await serviceHandler.userService.addAdventureTodo({
        userId: user_id,
        adventureId: adventure_id,
        isPublic: publicField
      })

    return sendResponse({
      req,
      res,
      data: {
        todo: {
          user_todo_field: userTodo,
          adventure_todo_field: adventureTodo
        }
      },
      status: CREATED
    })
  } catch (error) {
    throw returnError({ req, res, message: 'serverCreateTick', error })
  }
}

module.exports = {
  createTodo
}
