const { Router } = require('express')
const { createTodo } = require('../../Handlers/TodoAdventures')
const { createTodoValidator } = require('../../Validators/TodoValidators')

const router = Router()

router.post('/', createTodoValidator(), createTodo)

module.exports = router
