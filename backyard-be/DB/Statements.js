// users
export const createUserStatement = "INSERT INTO users (email, password, first_name, last_name) VALUES(?, ?, ?, ?)";
export const selectUserIdStatement = "SELECT id FROM users WHERE email = ?";
export const getUserWithEmailStatement = "SELECT * FROM users WHERE email = ?";
export const getUserByIdStatement = "SELECT * FROM users WHERE id = ?";

// adventures
export const createNewAdventureStatement = `INSERT INTO adventures (
adventure_type, adventure_name, approach_distance, season, avg_angle, max_angle,
difficulty, elevation, gear, gain, bio, nearest_city, creator_id, coordinates_lat, coordinates_lng) VALUES (
?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
export const selectAdventureByIdStatement = "SELECT * FROM adventures WHERE id = ?";
export const selectAdventuresInRangeStatement = `SELECT * FROM adventures WHERE
coordinates_lat <= ? AND coordinates_lat >= ?
AND coordinates_lng >= ? and coordinates_lng <= ?
AND adventure_type = ?`;

// ticks
export const selectTicksByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, t.creator_id FROM ticks AS t
INNER JOIN users AS u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.adventure_id = ?`;
export const selectTicksByUserStatement = `SELECT t.creator_id, a.adventure_name, a.adventure_type, a.difficulty, a.nearest_city FROM ticks AS t
INNER JOIN users as u ON t.creator_id = u.id
INNER JOIN adventures AS a ON t.adventure_id = a.id WHERE t.creator_id = ?`;
export const createTickStatement = `INSERT INTO ticks (creator_id, adventure_id, public) VALUES (?, ?, ?)`;

// activities
export const selectActivitiesByAdventureStatement = `SELECT u.first_name, u.last_name, u.email, ac.creator_id FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.adventure_id = ?`;
export const selectActivitiesByUserStatement = `SELECT ac.creator_id, a.adventure_name, a.adventure_type, a.difficulty, a.nearest_city FROM activities AS ac
INNER JOIN users AS u ON ac.creator_id = u.id
INNER JOIN adventures AS a ON ac.adventure_id = a.id WHERE ac.creator_id = ?`;
export const createActivityStatement = "INSERT INTO activities (creator_id, adventure_id, public) VALUES (?, ?, ?)";
export const countActivitiesStatement = "SELECT COUNT(adventure_id) FROM activities WHERE creator_id = ?";

// password_reset
export const savePasswordResetTokenStatement = `INSERT INTO password_reset_tokens (email, reset_token) VALUES (?, ?)`;
export const getPasswordResetEmailStatement = `SELECT email FROM password_reset_tokens WHERE reset_token = ?`;

// followers
export const followUserStatement = `INSERT INTO followers (follower_id, leader_id, public) VALUES (?, ?, ?)`;
export const getFollowersStatement = `SELECT u.first_name, u.last_name, f.follower_id, u.email FROM followers AS f
INNER JOIN users AS u ON f.follower_id = u.id WHERE f.leader_id = ?`;
export const getFollowersCountStatement = `SELECT COUNT(follower_id) FROM followers WHERE leader_id = ?`;
export const getFollowingStatement = `SELECT u.first_name, u.last_name, f.leader_id, u.email FROM followers AS f
INNER JOIN users AS u ON f.leader_id = u.id WHERE f.follower_id = ?`;
export const getFollowingCountStatement = `SELECT COUNT(leader_id) FROM followers WHERE follower_id = ?`;