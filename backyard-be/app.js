const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { config } = require('dotenv')

const router = require('./Routing')
const { corsHandler } = require('./Config/cors.js')
const authService = require('./Services/auth.service')

config()

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// security middleware
app.use(cors({ origin: corsHandler }))
app.use(helmet({
	dnsPrefetchControl: false,
	frameguard: false,
	ieNoOpen: false
}))

// public routes
app.use('/api', authService.validate, router)

module.exports = app