const mysql = require('mysql2/promise')
const { getDBConnectionObject } = require('./connections')

const dbConnectionObject = getDBConnectionObject()
const pool = mysql.createPool({
  ...dbConnectionObject,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = pool
