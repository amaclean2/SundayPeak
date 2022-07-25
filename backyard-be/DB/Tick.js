import db from '../Config/db.js';
import {
    selectTicksByAdventureStatement,
    createTickStatement,
    selectTicksByUserStatement
} from './Statements.js';

export const getTicksByAdventure = async ({ adventure_id }) => {
    return db.promise().execute(selectTicksByAdventureStatement, [adventure_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const getTicksByUser = async ({ user_id }) => {
    return db.promise().execute(selectTicksByUserStatement, [user_id])
        .then(([results, ...extras]) => results)
        .catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const createTick = async ({ adventure_id, user_id: creator_id, public: publicField }) => {
    return db.promise().execute(createTickStatement, [creator_id, adventure_id, publicField])
        .then(([results, ...extras]) => {
            const { insertId } = results;
            return insertId;
        }).catch((error) => {
            console.log("DATABASE_INSERTION_FAILED", error);
            throw error;
        });
};