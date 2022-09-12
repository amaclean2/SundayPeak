// users
const createUserStatement = 'INSERT INTO users (email, password, first_name, last_name) VALUES(?, ?, ?, ?)';
const selectUserIdStatement = 'SELECT id FROM users WHERE email = ?';
const getUserWithEmailStatement = 'SELECT * FROM users WHERE email = ?';
const getUserByIdStatement = 'SELECT * FROM users WHERE id = ?';
const updateUsersStatement = 'UPDATE users SET ? = ? WHERE id = ?';
const deleteUserStatement = 'DELETE FROM users WHERE id = ?';

// adventures
const createNewAdventureStatement = `INSERT INTO adventures (
adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat, coordinates_lng) VALUES (
?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const selectAdventureByIdStatement = 'SELECT * FROM adventures WHERE id = ?';
const selectAdventuresInRangeStatement = `SELECT * FROM adventures WHERE
coordinates_lat <= ? AND coordinates_lat >= ?
AND coordinates_lng >= ? and coordinates_lng <= ?
AND adventure_type = ?`;
const updateAdventuresStatement = 'UPDATE adventures SET ? = ? WHERE id = ?';
const deleteAdventureStatement = 'DELETE FROM adventures WHERE id = ?';

// ticks
const selectTicksByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, t.creator_id FROM ticks AS t
INNER JOIN users AS u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.adventure_id = ?`;
const selectTicksByUserStatement = `SELECT t.creator_id, a.adventure_name, a.adventure_type, a.difficulty, a.nearest_city FROM ticks AS t
INNER JOIN users as u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.creator_id = ?`;
const createTickStatement = `INSERT INTO ticks (creator_id, adventure_id, public) VALUES (?, ?, ?)`;
const deleteTickByUserStatement = 'DELETE FROM ticks WHERE creator_id = ?';
const deleteTickByAdventureStatement = 'DELETE FROM ticks WHERE adventure_id = ?';
const delteTickStatement = 'DELETE FROM ticks WHERE id = ?';

// activities
const selectActivitiesByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, ac.creator_id FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.adventure_id = ?`;
const selectActivitiesByUserStatement = `SELECT ac.creator_id, a.adventure_name, a.adventure_type, a.difficulty, a.nearest_city FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.creator_id = ?`;
const createActivityStatement = 'INSERT INTO activities (creator_id, adventure_id, public) VALUES (?, ?, ?)';
const countActivitiesStatement = 'SELECT COUNT(adventure_id) FROM activities WHERE creator_id = ?';
const deleteActivityByUserStatement = 'DELETE FROM activities WHERE creator_id = ?';
const deleteActivityByAdventureStatement = 'DELETE FROM activities WHERE adventure_id = ?';
const delteActivityStatement = 'DELETE FROM activities WHERE id = ?';

// password_reset
const savePasswordResetTokenStatement = `INSERT INTO password_reset_tokens (email, reset_token) VALUES (?, ?)`;
const getPasswordResetEmailStatement = `SELECT email FROM password_reset_tokens WHERE reset_token = ?`;

// followers
const followUserStatement = `INSERT INTO followers (follower_id, leader_id, public) VALUES (?, ?, ?)`;
const getFollowersStatement = `SELECT u.first_name, u.last_name, f.follower_id, u.email FROM followers AS f
INNER JOIN users AS u ON f.follower_id = u.id WHERE f.leader_id = ?`;
const getFollowersCountStatement = `SELECT COUNT(follower_id) FROM followers WHERE leader_id = ?`;
const getFollowingStatement = `SELECT u.first_name, u.last_name, f.leader_id, u.email FROM followers AS f
INNER JOIN users AS u ON f.leader_id = u.id WHERE f.follower_id = ?`;
const getFollowingCountStatement = `SELECT COUNT(leader_id) FROM followers WHERE follower_id = ?`;

// pictures
const createUserPictureStatement = 'INSERT INTO user_images (file_name, creator_id, public) VALUES (?, ?, 0)';
const createAdventurePictureStatement = 'INSERT INTO user_images (file_name, creator_id, adventure_id, public) VALUES (?, ?, ?, 0)';
const getAdventurePicturesStatement = 'SELECT file_name FROM user_images WHERE adventure_id = ?';
const getUserPicturesStatement = 'SELECT file_name FROM user_images WHERE creator_id = ?';
const deletePictureStatement = 'DELETE FROM user_images WHERE file_name = ?';

module.exports = {
    createUserStatement,
    selectUserIdStatement,
    getUserWithEmailStatement,
    getUserByIdStatement,
    updateUsersStatement,
    deleteUserStatement,
    createNewAdventureStatement,
    selectAdventureByIdStatement,
    selectAdventuresInRangeStatement,
    updateAdventuresStatement,
    deleteAdventureStatement,
    selectTicksByAdventureStatement,
    selectTicksByUserStatement,
    createTickStatement,
    deleteTickByUserStatement,
    deleteTickByAdventureStatement,
    delteTickStatement,
    selectActivitiesByAdventureStatement,
    selectActivitiesByUserStatement,
    createActivityStatement,
    countActivitiesStatement,
    deleteActivityByUserStatement,
    deleteActivityByAdventureStatement,
    delteActivityStatement,
    savePasswordResetTokenStatement,
    getPasswordResetEmailStatement,
    followUserStatement,
    getFollowersStatement,
    getFollowersCountStatement,
    getFollowingStatement,
    getFollowingCountStatement,
    createUserPictureStatement,
    createAdventurePictureStatement,
    getAdventurePicturesStatement,
    getUserPicturesStatement,
    deletePictureStatement
}