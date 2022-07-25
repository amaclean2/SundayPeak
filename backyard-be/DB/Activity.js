import db from '../Config/db.js';
import {
    selectActivitiesByAdventureStatement,
    selectActivitiesByUserStatement,
    createActivityStatement,
    countActivitiesStatement
} from './Statements.js';

export const getActivitiesByAdventure = async ({ adventure_id }) => {
    return db.promise().execute(selectActivitiesByAdventureStatement, [adventure_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const getActivitiesByUser = async ({ user_id }) => {
    return db.promise().execute(selectActivitiesByUserStatement, [user_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const getActivityCountByUser = async ({ user_id }) => {
    return db.promise().execute(countActivitiesStatement, [user_id])
        .then(([results, ...extras]) => results[0]['COUNT(id)'])
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const createActivity = async ({ adventure_id, user_id: creator_id, public: publicField }) => {
    return db.promise().execute(createActivityStatement, [creator_id, adventure_id, publicField])
        .then(([results, ...extras]) => {
            const { insertId } = results;
            return insertId;
        }).catch((error) => {
            console.log("DATABASE_INSERTION_FAILED", error);
            throw error;
        });
};