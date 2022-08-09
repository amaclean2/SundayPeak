import db from '../Config/db.js';
import {
    createUserStatement,
    selectUserIdStatement,
    getUserByIdStatement,
    getUserWithEmailStatement,
    savePasswordResetTokenStatement,
    getPasswordResetEmailStatement,
    getFollowersCountStatement,
    followUserStatement,
    getFollowersStatement,
    getFollowingCountStatement,
    deleteUserStatement,
    deleteTickByUserStatement,
    deleteActivityByUserStatement,
    updateUsersStatement
} from './Statements.js';

export const addUser = async ({ email, password, first_name, last_name }) => {
    return db.promise().execute(createUserStatement, [email, password, first_name, last_name])
        .then((result) => result[0].insertId)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

export const checkForUser = async (email) => {
    return db.promise().execute(selectUserIdStatement, [email])
        .then(([results, ...extras]) => !!results.length)
        .catch((error) => {
            throw {
                message: 'Database query failed',
                error
            };
        });
};

export const getUser = async (email) => {
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

export const getUserById = async (id) => {
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

export const savePasswordResetToken = async ({ email, token }) => {
    return db.promise().execute(savePasswordResetTokenStatement, [email, token])
        .then((result) => result[0].insertId)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

export const getPasswordResetEmail = async ({ token }) => {
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

export const followUser = async ({ follower_id, leader_id }) => {
    return db.promise().execute(followUserStatement, [follower_id, leader_id, false])
        .then(([results, ...extras]) => {
            const { insertId } = results;
            return insertId;
        }).catch((error) => {
            console.log("DATABASE_INSERTION_FAILED", error);
            throw error;
        });
};

export const getFollowerCount = async ({ user_id }) => {
    return db.promise().execute(getFollowersCountStatement, [user_id])
        .then(([results, ...extras]) => results[0]['COUNT(follower_id)'])
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const getFollowingCount = async ({ user_id }) => {
    return db.promise().execute(getFollowingCountStatement, [user_id])
        .then(([results, ...extras]) => results[0]['COUNT(leader_id)'])
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const getFollowersLookup = async ({ user_id }) => {
    return db.promise().execute(getFollowersStatement, [user_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const updateUser = async ({ fields }) => {
    const promiseList = fields.map((field) => {
        return new Promise((res, rej) => {
            db.promise().execute(updateUsersStatement, [field.field_name, field.field_value, field.id])
                .then(([result, ...extras]) => res(result))
                .catch((error) => {
                    console.log('UPDATE_FAILED');
                    rej(error);
                });
        });
    });

    return Promise.all(promiseList)
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log('DATA_UPDATE_FAILED');
            throw error;
        })
};

export const deleteUser = async (userId) => {
    return db.promise().execite(deleteTickByUserStatement, [userId])
        .then(() => db.promise().execute(deleteActivityByUserStatement, [userId]))
        .then(() => db.promise().execute(deleteUserStatement, [userId]))
        .then(([result, ...extras]) => result)
        .catch((error) => {
            console.log('DATABASE_DELETION_FAILED');
            throw error;
        });
};