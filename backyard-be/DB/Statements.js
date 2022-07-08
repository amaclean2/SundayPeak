const db = require("../Config/db");

const createUserStatement = "INSERT INTO users (email, password, first_name, last_name) VALUES(?, ?, ?, ?)";
const selectUserIdStatement = "SELECT id FROM users WHERE email = ?";
const getUserWithEmailStatement = "SELECT * FROM users WHERE email = ?";
const getUserByIdStatement = "SELECT * FROM users WHERE id = ?";

const createNewAdventureStatement = `INSERT INTO adventures (
    adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
    difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat, coordinates_lng) VALUES (
    ?, ?, ?, ?', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const selectAdventureByIdStatement = "SELECT * FROM adventures WHERE id = ?";
const selectAdventuresInRangeStatement = `SELECT * FROM adventures WHERE
    coordinates_lat <= ? AND coordinates_lat >= ?
    AND coordinates_lng >= ? and coordinates_lng <= ?
    AND adventure_type = ?`;

const selectTicksByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, a.elevation, a.bio FROM ticks AS t
    INNER JOIN users AS u ON t.user_id = u.id
    INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE a.id = ?`;

module.exports = {
    createUserStatement,
    selectUserIdStatement,
    getUserWithEmailStatement,
    getUserByIdStatement,
    createNewAdventureStatement,
    selectAdventureByIdStatement,
    selectAdventuresInRangeStatement,
    selectTicksByAdventureStatement
};