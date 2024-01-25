const spdy = require('spdy')
const http = require('http')
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')

const app = require('@amaclean2/sundaypeak-rivers')
const { onConnection } = require('@amaclean2/sundaypeak-couloirs')

const PORT = process.env.PORT || 5000
const HTTP_PORT = process.env.HTTP_PORT || 80

// created by following https://www.youtube.com/watch?v=USrMdBF0zcg

const serverCerts =
  process.env.NODE_ENV === 'production'
    ? {
        key: fs.readFileSync(
          '/etc/letsencrypt/live/api.sundaypeak.com/privkey.pem'
        ),
        cert: fs.readFileSync(
          '/etc/letsencrypt/live/api.sundaypeak.com/fullchain.pem'
        )
      }
    : {
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
      }

const server = spdy.createServer(serverCerts, app)

const wss = new WebSocket.Server({ server })
wss.on('connection', onConnection)

server.listen(PORT, () =>
  console.log(`Sunday Peak API/Websocket listening on port ${PORT}`)
)

// certbot server
http
  .createServer((req, res) => {
    if (req.url.includes('/.well-known/acme-challenge')) {
      // list all the files in the html directory
      const files = fs.readdirSync('./var/www/html')
      // read the first file
      const certbotFiles = fs.readFileSync('./var/www/html', files[0])
      // output the contents from the first file
      res.write(certbotFiles)
      res.end()
    } else {
      res.write('this path is not designed for this')
      res.end()
    }
  })
  .listen(HTTP_PORT)
