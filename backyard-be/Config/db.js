const mysql = require('mysql2');

const { getDBConnectionObject } = require('./connections');

// module.exports = mysql.createConnection({
//     host: 'backyard-stage-db-do-user-6012695-0.b.db.ondigitalocean.com',
//     port: '25060',
//     user: 'byf',
//     password: 'AVNS_lM25mnEfowo3P0b7CEb',
//     database: 'friends'
// });

const dbConnectionObject = getDBConnectionObject();
console.log("DB_OBJECT", dbConnectionObject)

module.exports = mysql.createConnection(dbConnectionObject);