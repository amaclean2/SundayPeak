const db = require('../Config/db');
const { selectTicksByAdventureStatement } = require('./Statements');

const getTicksByAdventure = async ({ adventure_id }) => {
    try {
        return db.promise().execute(selectTicksByAdventureStatement, [adventure_id])
            .then(([results, ...extras]) => {
                return results[0];
            }).catch((error) => {
                console.log("DATABASE_ERROR", error);
                throw error;
            });
    } catch (error) {
        console.log("DATABASE_RETRIEVAL_FAILED", error);
        throw error;
    }
};

module.exports = {
    getTicksByAdventure
};