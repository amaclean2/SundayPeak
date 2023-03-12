const createNewSkiAdventureStatement =
  'INSERT INTO adventures (adventure_ski_id, adventure_name, adventure_type, bio, coordinates_lat, coordinates_lng, creator_id, nearest_city, public, rating) VALUES ?'
const createNewClimbAdventureStatement =
  'INSERT INTO adventures (adventure_climb_id, adventure_name, adventure_type, bio, coordinates_lat, coordinates_lng, creator_id, nearest_city, public, rating) VALUES ?'
const createNewHikeAdventureStatement =
  'INSERT INTO adventures (adventure_hike_id, adventure_name, adventure_type, bio, coordinates_lat, coordinates_lng, creator_id, nearest_city, public, rating) VALUES ?'
const createNewSkiStatement =
  'INSERT INTO ski (avg_angle, max_angle, approach_distance, aspect, difficulty, summit_elevation, base_elevation, exposure, gear, season) VALUES ?'
const createNewClimbStatement =
  'INSERT INTO climb (grade, pitches, protection, climb_type, light_times, season, approach, first_ascent) VALUES ?'
const createNewHikeStatement =
  'INSERT INTO hike (difficulty, summit_elevation, base_elevation, distance, season) VALUES ?'

const getAdventureTypeStatement =
  'SELECT adventure_type FROM adventures WHERE id = ?'

const selectAdventureByIdGroup = {
  ski: 'SELECT a.id AS id, a.adventure_name AS adventure_name, a.adventure_type AS adventure_type, a.bio AS bio, a.coordinates_lat AS coordinates_lat, a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, CONCAT(u.first_name, " ", u.last_name) AS creator_name, u.email AS creator_email, a.date_created AS date_created, a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, s.avg_angle AS avg_angle, s.max_angle AS max_angle, s.approach_distance AS approach_distance, s.aspect AS aspect, s.difficulty AS difficulty, s.summit_elevation AS summit_elevation, s.base_elevation AS base_elevation, s.exposure AS exposure, s.gear AS gear, s.season AS season FROM adventures AS a INNER JOIN ski AS s ON a.adventure_ski_id = s.id INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?',
  climb:
    'SELECT a.id AS id, a.adventure_name AS adventure_name, a.adventure_type AS adventure_type, a.bio AS bio, a.coordinates_lat AS coordinates_lat, a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, CONCAT(u.first_name, " ", u.last_name) AS creator_name, u.email AS creator_email, a.date_created AS date_created, a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, c.grade AS grade, c.first_ascent AS first_ascent, c.pitches AS pitches, c.protection AS protection, c.approach AS approach, c.climb_type AS climb_type, c.season AS season FROM adventures AS a INNER JOIN climb AS c ON a.adventure_climb_id = c.id INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?',
  hike: 'SELECT a.id AS id, a.adventure_name AS adventure_name, a.adventure_type AS adventure_type, a.bio AS bio, a.coordinates_lat AS coordinates_lat, a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, CONCAT(u.first_name, " ", u.last_name) AS creator_name, u.email AS creator_email, a.date_created AS date_created, a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, h.difficulty AS difficulty, h.summit_elevation AS summit_elevation, h.base_elevation AS base_elevation, h.distance AS distance, h.season AS season FROM adventures AS a INNER JOIN hike AS h ON a.adventure_hike_id = h.id INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?'
}

const addKeywordStatement =
  'REPLACE INTO searchable_adventures (searchable_text, adventure_id) VALUES (?, ?)'
const searchAdventureStatement =
  'SELECT a.adventure_name, a.id, a.adventure_type, a.nearest_city FROM adventures AS a INNER JOIN searchable_adventures AS sa ON sa.adventure_id = a.id WHERE sa.searchable_text LIKE ?'

const getKeywordsStatement =
  'SELECT a.adventure_name, a.adventure_type, a.bio, CONCAT(u.first_name, u.last_name) AS creator_name, a.nearest_city, a.coordinates_lat, a.coordinates_lng, a.public FROM adventures AS a INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?'

const selectAdventuresInRangeStatement =
  'SELECT id, adventure_name, adventure_type, public, coordinates_lat, coordinates_lng FROM adventures WHERE adventure_type = ? AND public = 1'
const getSpecificAdventureId =
  "SELECT adventure_type, CASE WHEN adventure_type = 'ski' THEN adventure_ski_id WHEN adventure_type = 'hike' THEN adventure_hike_id ELSE adventure_climb_id END AS specific_adventure_id FROM adventures WHERE id = ?"

const updateAdventureStatements = {
  adventure_name: 'UPDATE adventures SET adventure_name = ? WHERE id = ?',
  avg_angle:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.avg_angle = ? WHERE a.id = ?',
  max_angle:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.max_angle = ? WHERE a.id = ? ',
  approach_distance:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.approach_distance = ? WHERE a.id = ?',
  hike_distance:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.distance = ? WHERE a.id = ?',
  aspect:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.aspect = ? WHERE a.id = ?',
  bio: 'UPDATE adventures SET bio = ? WHERE id = ?',
  climb_approach:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.approach = ? WHERE a.id = ?',
  climb_type:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.climb_type = ? WHERE a.id = ?',
  ski_difficulty:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.difficulty = ? WHERE a.id = ?',
  hike_difficulty:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_climb_id = h.id SET h.difficulty = ? WHERE a.id = ?',
  duration:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.duration = ? WHERE a.id = ?',
  ski_summit_elevation:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.summit_elevation = ? WHERE a.id = ?',
  hike_summit_elevation:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.summit_elevation = ? WHERE a.id = ?',
  exposure:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.exposure = ? WHERE a.id = ?',
  first_ascent:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.first_ascent = ? WHERE a.id = ?',
  ski_base_elevation:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.base_elevation = ? WHERE a.id = ?',
  hike_base_elevation:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_climb_id = h.id SET h.base_elevation = ? WHERE a.id = ?',
  gear: 'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.gear = ? WHERE a.id = ?',
  grade:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.grade = ? WHERE a.id = ?',
  light_times:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.light_times WHERE a.id = ?',
  nearest_city: 'UPDATE adventures SET nearest_city = ? WHERE id = ?',
  pitches:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.pitches = ? WHERE a.id = ?',
  protection:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.protection = ? WHERE a.id = ?',
  public: 'UPDATE adventures SET public = ? WHERE id = ?',
  rating: 'UPDATE adventures SET ration = ? WHERE id = ?',
  ski_season:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.season = ? WHERE a.id = ?',
  climb_season:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.season = ? WHERE a.id = ?',
  hike_season:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_climb_id = h.id SET h.season = ? WHERE a.id = ?'
}

const deleteSkiStatement =
  'DELETE s.* FROM ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id WHERE s.id = a.adventure_ski_id AND a.id = ?'
const deleteClimbStatement =
  'DELETE c.* FROM climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id WHERE c.id = a.adventure_climb_id AND a.id = ?'
const deleteHikeStatement =
  'DELETE h.* FROM hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id WHERE h.id = a.adventure_hike_id AND a.id = ?'

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
  getSpecificAdventureId,
  deleteSkiStatement,
  deleteClimbStatement,
  deleteHikeStatement,
  searchAdventureStatement,
  getAdventureTypeStatement,
  getKeywordsStatement,
  addKeywordStatement
}
