const mysql = require('mysql2/promise')
const { config } = require('dotenv')
const { getDBConnectionObject } = require('./connections')

config()

const dbConnectionObject = getDBConnectionObject()
const pool = mysql.createPool({
  ...dbConnectionObject,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const sendQuery = (queryStatement, queryParameters) => {
  return pool.execute(queryStatement, queryParameters)
}

module.exports = {
  db: pool,
  sendQuery
}
