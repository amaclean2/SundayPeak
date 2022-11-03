const jwt = require('jsonwebtoken')

const { getJWTSecret } = require('../Config/connections.js')
const { isExempt, isPath } = require('../Config/exemptGql.js')
const { returnError } = require('../ResponseHandling')

const issue = (payload) =>
  jwt.sign(payload, getJWTSecret(), { expiresIn: '48h' })
const validate = async (req, res, next) => {
  if (isExempt(req)) {
    return next()
  }

  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    let bearerToken = bearerHeader.split(' ').pop()

    while (bearerToken?.includes('"')) {
      bearerToken = bearerToken.replace('"', '')
    }

    jwt.verify(bearerToken, getJWTSecret(), {}, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return next()
        }

        return returnError({
          req,
          res,
          message: error.name,
          error
        })
      } else {
        if (!req.body) req.body = { id_from_token: decoded.id }
        else req.body.id_from_token = decoded.id

        return next()
      }
    })
  } else {
    if (isPath(req, '/initial')) {
      return next()
    }

    return returnError({
      req,
      res,
      message: 'notLoggedIn'
    })
  }
}

module.exports = {
  issue,
  validate
}
