const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'byf',
    password: 'backyard',
    database: 'friends'
});