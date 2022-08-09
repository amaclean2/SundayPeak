import db from '../Config/db.js';
import {
    createNewAdventureStatement,
    deleteActivityByAdventureStatement,
    deleteAdventureStatement,
    deleteTickByAdventureStatement,
    selectAdventureByIdStatement,
    selectAdventuresInRangeStatement
} from './Statements.js';

export const addAdventure = async (adventure) => {
    const {
        adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
        difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat,
        coordinates_lng
    } = adventure;

    return db.promise().execute(createNewAdventureStatement, [
        adventure_type,
        adventure_name,
        approach_distance || 0,
        season || '',
        avg_angle || 0,
        max_angle || 0,
        difficulty || 0,
        elevation || 0,
        gear || '',
        gain || 0,
        bio || '',
        nearest_city || '',
        creator_id,
        coordinates_lat,
        coordinates_lng
    ]).then(([results, ...extras]) => {
        const { insertId, ...everythingElse } = results;

        return insertId;
    }).catch((error) => {
        console.log('DATABASE_INSERTION_FAILED', error);
        throw error;
    });
};

export const getAdventure = async (id) => {
    return db.promise().execute(selectAdventureByIdStatement, [id])
        .then(([results, ...extras]) => {
            return results[0];
        }).catch((error) => {
            console.log("DATABASE_RETRIEVAL_FAILED", error);
            throw error;
        });
};

export const getAdventures = async (coordinates, type) => {

    return db.promise().execute(selectAdventuresInRangeStatement, [
        coordinates.maxLat,
        coordinates.minLat,
        coordinates.minLng,
        coordinates.maxLng,
        type
    ]).then(([results, ...extras]) => {
        return results.map((result) => {
            const newResult = {
                ...result,
                coordinates: {
                    lat: result.coordinates_lat,
                    lng: result.coordinates_lng
                }
            };
            delete newResult.coordinates_lat;
            delete newResult.coordinates_lng;

            return newResult;
        });
    }).catch((error) => {
        console.log('DATABASE_RETRIEVAL_FAILED', error);
        throw error;
    });
};

export const deleteAdventure = async (adventureId) => {
    return db.promise().execite(deleteTickByAdventureStatement, [adventureId])
        .then(() => db.promise().execute(deleteActivityByAdventureStatement, [adventureId]))
        .then(() => db.promise().execute(deleteAdventureStatement, [adventureId]))
        .then(([result, ...extras]) => result)
        .catch((error) => {
            console.log('DATABASE_DELETION_FAILED');
            throw error;
        })
};