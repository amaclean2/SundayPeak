const logger = require('../Config/logger')
const data = require('./data.json')

// all sample functions need to return promises to simulate the actual database calls

const getSampleUser = async ({ email, id }) => {
  const { users } = data
  logger.debug({ users })
  return users.find((user) => user.id === id || user.email === email)
}

const getFilteredUsers = async ({ keyword }) => {
  const { users } = data
  const formattedKeyword = keyword.toLowerCase()
  return users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(formattedKeyword) ||
      user.email.toLowerCase().includes(formattedKeyword) ||
      user.city.toLowerCase().includes(formattedKeyword)
  )
}

module.exports = {
  getSampleUser,
  getFilteredUsers
}
