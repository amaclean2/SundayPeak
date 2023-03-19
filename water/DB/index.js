const mysql = require('mysql2/promise')

class DataLayer {
  constructor(sendQuery) {
    this.sendQuery = sendQuery
  }
}

module.exports = DataLayer
