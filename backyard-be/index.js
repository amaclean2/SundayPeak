const app = require('./app')
const logger = require('./Config/logger')

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
	const host = server.address().address
	const workingPort = server.address().port

	logger.info(`Backyard friends backend listening to http://${host}:${workingPort}`)
})