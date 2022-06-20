const db = require('../Config/db');

const addUser = async (user) => {
    const { email, password, first_name, last_name, city, bio } = user;
    try {
        return db.promise().query(`INSERT INTO users (email, password, first_name, last_name) VALUES
        ('${email}', '${password}', '${first_name}', '${last_name}');`)
            .then(() => db.promise().query(`SELECT id FROM users WHERE email = '${email}';`))
            .then(([results, ...extras]) => results[0]);

    } catch (error) {
        throw new Error('Database insertion failed', error);
    }
};

const checkForUser = async (email) => {
    return db.promise().query(`SELECT id FROM users WHERE email = '${email}';`)
        .then(([results, ...extras]) => !!results.length)
        .catch((error) => {
            throw new Error('Database query failed', error);
        });
};

const getUser = async (email) => {
    return db.promise().query(`SELECT * FROM users WHERE email = '${email}';`)
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
    return db.promise().query(`SELECT * FROM users WHERE id = '${id}';`)
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