const db = require('../Config/db');
const {
    createUserStatement,
    selectUserIdStatement,
    getUserByIdStatement,
    getUserWithEmailStatement,
    savePasswordResetTokenStatement,
    getPasswordResetEmailStatement,
    getFollowersCountStatement,
    followUserStatement,
    getFollowersStatement,
    getFollowingCountStatement
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
            throw {
                message: 'Database query failed',
                error
            };
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
            throw {
                message: 'Database query failed',
                error
            };
        });
};

const savePasswordResetToken = async ({ email, token }) => {
    return db.promise().execute(savePasswordResetTokenStatement, [email, token])
        .then((result) => result[0].insertId)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

const getPasswordResetEmail = async ({ token }) => {
    return db.promise().execute(getPasswordResetEmailStatement, [token])
        .then(([results, ...extras]) => {
            if (!results.length) {
                return null;
            }

            return results[0];
        }).catch((error) => {
            throw {
                message: 'Database query failed',
                error
            };
        })
};

const followUser = async ({ follower_id, leader_id }) => {
    return db.promise().execute(followUserStatement, [follower_id, leader_id, false])
        .then(([results, ...extras]) => {
            const { insertId } = results;
            return insertId;
        }).catch((error) => {
            console.log("DATABASE_INSERTION_FAILED", error);
            throw error;
        });
}

const getFollowerCountLookup = async ({ user_id }) => {
    return db.promise().execute(getFollowersCountStatement, [user_id])
        .then(([results, ...extras]) => results[0]['COUNT(id)'])
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

const getFollowingCountLookup = async ({ user_id }) => {
    return db.promise().execute(getFollowingCountStatement, [user_id])
        .then(([results, ...extras]) => results[0]['COUNT(id)'])
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
}

const getFollowersLookup = async ({ user_id }) => {
    return db.promise().execute(getFollowersStatement, [user_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
}

module.exports = {
    addUser,
    checkForUser,
    getUser,
    getUserById,
    savePasswordResetToken,
    getPasswordResetEmail,
    getFollowerCountLookup,
    getFollowingCountLookup,
    getFollowersLookup,
    followUser
};