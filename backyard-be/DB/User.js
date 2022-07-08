const db = require('../Config/db');
const {
    createUserStatement,
    selectUserIdStatement,
    getUserByIdStatement,
    getUserWithEmailStatement
} = require('./Statements');

const addUser = async ({ email, password, first_name, last_name }) => {
    return db.promise().execute(createUserStatement, [email, password, first_name, last_name])
        .then((result) => db.promise().execute(getUserByIdStatement, [result[0].insertId]))
        .then(([results, ...extras]) => results[0])
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

const checkForUser = async (email) => {
    return db.promise().execute(selectUserIdStatement, [email])
        .then(([results, ...extras]) => !!results.length)
        .catch((error) => {
            throw {
                message: 'Database query failed',
                error
            };
        });
};

const getUser = async (email) => {
    return db.promise().execute(getUserWithEmailStatement, [email])
        .then(([results, ...extras]) => {
            if (!results.length) {
                return null;
            }

            return results[0];
        }).catch((error) => {
            console.log("DATABASE_ERROR", error);
            throw new Error('Database query failed', error);
        });
};

const getUserById = async (id) => {
    return db.promise().execute(getUserByIdStatement, [id])
        .then(([results, ...extras]) => {
            if (!results.length) {
                return null;
            }

            return results[0];
        }).catch((error) => {
            console.log("DATABASE_ERROR", error);
            throw new Error('Database query failed', error);
        });
}

module.exports = {
    addUser,
    checkForUser,
    getUser,
    getUserById
};