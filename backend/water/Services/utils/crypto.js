const { scryptSync, timingSafeEqual, randomBytes } = require('crypto')

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('base64')
  const passwordHash = scryptSync(password, salt, 64).toString('base64')
  return `${salt}:${passwordHash}`
}

const comparePassword = (password, hashedPassword) => {
  const [salt, key] = hashedPassword.split(':')
  const hashedBuffer = scryptSync(password, salt, 64)

  const keyBuffer = Buffer.from(key, 'base64')
  const match = timingSafeEqual(hashedBuffer, keyBuffer)

  return match
}

module.exports = {
  hashPassword,
  comparePassword
}
