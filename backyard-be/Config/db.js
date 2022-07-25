import mysql from 'mysql2';
import { getDBConnectionObject } from './connections.js';

// module.exports = mysql.createConnection({
//     host: 'backyard-stage-db-do-user-6012695-0.b.db.ondigitalocean.com',
//     port: '25060',
//     user: 'byf',
//     password: 'AVNS_lM25mnEfowo3P0b7CEb',
//     database: 'friends'
// });

const dbConnectionObject = getDBConnectionObject();

export default mysql.createConnection(dbConnectionObject);