const db = require('../Config/db');
const {
    selectActivitiesByAdventureStatement,
    selectActivitiesByUserStatement,
    createActivityStatement,
    countActivitiesStatement
} = require('./Statements');

const getActivitiesByAdventure = async ({ adventure_id }) => {
    return db.promise().execute(selectActivitiesByAdventureStatement, [adventure_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

const getActivitiesByUser = async ({ user_id }) => {
    return db.promise().execute(selectActivitiesByUserStatement, [user_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

const getActivityCountByUser = async ({ user_id }) => {
    return db.promise().execute(countActivitiesStatement, [user_id])
        .then(([results, ...extras]) => results[0]['COUNT(id)'])
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

const createActivity = async ({ adventure_id, user_id: creator_id, public }) => {
    return db.promise().execute(createActivityStatement, [creator_id, adventure_id, public])
        .then(([results, ...extras]) => {
            const { insertId } = results;
            return insertId;
        }).catch((error) => {
            console.log("DATABASE_INSERTION_FAILED", error);
            throw error;
        });
};

module.exports = {
    getActivitiesByAdventure,
    getActivitiesByUser,
    getActivityCountByUser,
    createActivity
};