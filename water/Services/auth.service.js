const jwt = require('jsonwebtoken')

const { isExempt } = require('./utils/handlers')

class AuthService {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret || 'secret'
  }

  issue(payload) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '48h' })
  }

  validate({ originalUrl, token }) {
    return new Promise((res, rej) => {
      if (originalUrl && isExempt(originalUrl)) {
        res(true)
      }

      if (token === undefined || token === 'undefined') {
        rej('there was no autorization token provided')
      } else {
        jwt.verify(token, this.jwtSecret, {}, (error, decoded) => {
          error && rej(error)

          res({ idFromToken: decoded.id })
        })
      }
    })
  }
}

module.exports = AuthService
