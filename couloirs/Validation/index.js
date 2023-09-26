const jwt = require('jsonwebtoken')

const userValidation = ({ token }) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject('no token provided')
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (error, decoded) => {
      if (error) {
        reject(error)
      }

      resolve({ idFromToken: decoded.id })
    })
  })
}

module.exports = {
  userValidation
}
