const db = require('../Config/db');
const { selectTicksByAdventureStatement, createTickStatement, selectTicksByUserStatement } = require('./Statements');

const getTicksByAdventure = async ({ adventure_id }) => {
    return db.promise().execute(selectTicksByAdventureStatement, [adventure_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

const getTicksByUser = async ({ user_id }) => {
    return db.promise().execute(selectTicksByUserStatement, [user_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

const createTick = async ({ adventure_id, user_id: creator_id, public }) => {
    return db.promise().execute(createTickStatement, [creator_id, adventure_id, public])
        .then(([results, ...extras]) => {
            const { insertId } = results;
            return insertId;
        }).catch((error) => {
            console.log("DATABASE_INSERTION_FAILED", error);
            throw error;
        });
};

module.exports = {
    getTicksByAdventure,
    getTicksByUser,
    createTick
};