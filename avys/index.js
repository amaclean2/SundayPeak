const https = require('https')
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')

const app = require('@amaclean2/sundaypeak-rivers')
const { onConnection } = require('@amaclean2/sundaypeak-couloirs')

const PORT = process.env.PORT || 5000

// created by following https://www.youtube.com/watch?v=USrMdBF0zcg

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
  },
  app
)

const wss = new WebSocket.Server({ server })
wss.on('connection', onConnection)

server.listen(PORT, () =>
  console.log(`Sunday Peak API/Websocket listening on port ${PORT}`)
)
