const { Router } = require('express')
const { createTodo } = require('../../Handlers/TodoAdventures')
const { NOT_FOUND } = require('../../ResponseHandling/statuses')
const { createTodoValidator } = require('../../Validators/TodoValidators')

const router = Router()

router.post('/create', createTodoValidator(), createTodo)

router.use('/', (req, res) => {
  res.status(NOT_FOUND).json({
    data: {
      messasge: 'Please select a method on /todo_adventures',
      status: NOT_FOUND
    }
  })
})

module.exports = router
