const db = require('../Config/db');

const addAdventure = async (adventure) => {
    const {
        adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
        difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat,
        coordinates_lng
    } = adventure;

    const queryString = `INSERT INTO adventures (
        adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
        difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat, coordinates_lng) VALUES (
        '${adventure_type}', '${adventure_name}', ${approach_distance || 0}, '${season || ''}', ${avg_angle || 0}, ${max_angle || 0}, ${difficulty || 0},
        ${elevation || 0}, '${gear || ''}', ${gain || 0}, '${bio || ''}', '${nearest_city || ''}', ${creator_id}, ${coordinates_lat}, ${coordinates_lng}
        );`;

    try {
        return db.promise().query(queryString)
            .then(([results, ...extras]) => {
                const { insertId, ...everythingElse } = results;

                return insertId;
            })
            .catch((error) => {
                console.log('DATABASE_ERROR', error);
                throw new Error('DATABASE_ERROR', error);
            });

    } catch (error) {
        console.log("DATABASE_INSERTION_FAILED", error);
        throw new Error('DATABASE_INSERTION_FAILED', error);
    };
};

const getAdventures = async (coordinates, type, zoom) => {

    const extremes = {
        minLat: coordinates.lat - 2,
        maxLat: coordinates.lat + 2,
        minLng: coordinates.lng - 2,
        maxLng: coordinates.lng + 2
    };

    const queryString = `SELECT * FROM adventures WHERE
        coordinates_lat <= ${extremes.maxLat} AND coordinates_lat >= ${extremes.minLat}
        AND coordinates_lng >= ${extremes.minLng} and coordinates_lng <= ${extremes.maxLng}
        AND adventure_type = '${type}';`;

    try {
        return db.promise().query(queryString)
            .then(([results, ...extras]) => {
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
                console.log('DATABASE_ERROR', error);
                throw new Error('DATABASE_ERROR', error);
            });
    } catch (error) {
        console.log("DATABASE_INSERTION_FAILED", error);
        throw new Error('Database insertion failed');
    };
};

module.exports = {
    addAdventure,
    getAdventures
};