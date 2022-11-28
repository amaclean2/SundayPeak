const createNewSkiAdventureStatement = `INSERT INTO adventures (
  adventure_ski_id, adventure_name, adventure_type, bio, coordinates_lat,
  coordinates_lng, creator_id, nearest_city, public, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const createNewClimbAdventureStatement = `INSERT INTO adventures (
  adventure_climb _id, adventure_name, adventure_type, bio, coordinates_lat,
  coordinates_lng, creator_id, nearest_city, public, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const createNewHikeAdventureStatement = `INSERT INTO adventures (
  adventure_hike_id, adventure_name, adventure_type, bio, coordinates_lat,
  coordinates_lng, creator_id, nearest_city, public, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const createNewSkiStatement = `INSERT INTO ski (avg_angle, max_angle, approach_distance,
  aspect, difficulty, elevation, exposure, gain, gear, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const createNewClimbStatement = `INSERT INTO climb (grade, pitches, protection, climb_type,
  light_times, season) VALUES (?, ?, ?, ?, ?, ?)`
const createNewHikeStatement =
  'INSERT INTO hike (difficulty, elevation, duration, season, gain) VALUES (?, ?, ?, ?, ?)'

const selectAdventureByIdGroup = {
  ski: `SELECT a.adventure_name AS adventure_name, a.bio AS bio, a.coordinates_lat AS coordinates_lat,
  a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, a.date_created AS date_created,
  a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, s.avg_angle AS avg_angle,
  s.max_angle AS max_angle, s.approach_distance AS approach_distance, s.aspect AS aspect, s.difficulty AS difficulty,
  s.elevation AS elevation, s.exposure AS exposure, s.gain AS gain, s.gear AS gear, s.season AS season FROM adventures AS a
  INNER JOIN ski AS s ON a.adventure_ski_id = s.id WHERE a.id = ?`,
  climb:
    'SELECT * FROM adventures AS a INNER JOIN climb AS c ON a.adventure_climb_id = c.id WHERE a.id = ?',
  hike: 'SELECT * FROM adventures AS a INNER JOIN hike AS h ON a.adventure_hike_id = h.id WHERE a.id = ?'
}

const selectAdventuresInRangeStatement = `SELECT id, adventure_name, adventure_type, public FROM adventures WHERE
coordinates_lat <= ? AND coordinates_lat >= ?
AND coordinates_lng >= ? and coordinates_lng <= ?
AND adventure_type = ?`
const updateAdventureStatements = {
  adventure_name: 'UPDATE adventures SET adventure_name = ? WHERE id = ?',
  avg_angle: 'UPDATE ski SET adventure_name = ? WHERE id = ?',
  max_angle: 'UPDATE ski SET max_angle = ? WHERE id = ?',
  approach_distance: 'UPDATE ski SET approach_distance = ? WHERE id = ?',
  aspect: 'UPDATE ski SET aspect = ? WHERE id = ?',
  bio: 'UPDATE adventures SET bio = ? WHERE id = ?',
  climb_type: 'UPDATE climb SET climb_type = ? WHERE id = ?',
  ski_difficulty: 'UPDATE ski SET difficulty = ? WHERE id = ?',
  hike_difficulty: 'UPDATE hike SET difficulty = ? WHERE id = ?',
  duration: 'UPDATE hike SET duration = ? WHERE id = ?',
  ski_elevation: 'UPDATE ski SET elevation = ? WHERE id = ?',
  hike_elevation: 'UPDATE hike SET elevation = ? WHERE id = ?',
  exposure: 'UPDATE ski SET exposure = ? WHERE id = ?',
  ski_gain: 'UPDATE ski SET gain = ? WHERE id = ?',
  hike_gain: 'UPDATE hike SET gain = ? WHERE id = ?',
  gear: 'UPDATE ski SET gear = ? WHERE id = ?',
  grade: 'UPDATE climb SET grade = ? WHERE id = ?',
  light_times: 'UPDATE climb SET light_times WHERE id = ?',
  nearest_city: 'UPDATE adventures SET nearest_city = ? WHERE id = ?',
  pitches: 'UPDATE climb SET pitches = ? WHERE id = ?',
  protection: 'UPDATE climb SET protection = ? WHERE id = ?',
  public: 'UPDATE adventures SET public = ? WHERE id = ?',
  rating: 'UPDATE adventures SET ration = ? WHERE id = ?',
  ski_season: 'UPDATE ski SET season = ? WHERE id = ?',
  climb_season: 'UPDATE climb SET season = ? WHERE id = ?',
  hike_season: 'UPDATE hike SET season = ? WHERE id = ?'
}
const deleteAdventureStatement = 'DELETE FROM adventures WHERE id = ?'
const deleteSkiStatement = 'DELETE FROM ski WHERE id = ?'
const deleteClimbStatement = 'DELETE FROM climb WHERE id = ?'
const deleteHikeStatement = 'DELETE FROM hike WHERE id = ?'

module.exports = {
  createNewSkiAdventureStatement,
  createNewClimbAdventureStatement,
  createNewHikeAdventureStatement,
  createNewSkiStatement,
  createNewClimbStatement,
  createNewHikeStatement,
  selectAdventureByIdGroup,
  selectAdventuresInRangeStatement,
  updateAdventureStatements,
  deleteAdventureStatement,
  deleteSkiStatement,
  deleteClimbStatement,
  deleteHikeStatement
}
