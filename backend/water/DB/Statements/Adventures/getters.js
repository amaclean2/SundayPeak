// get adventure type
const getAdventureTypeStatement =
  'SELECT adventure_type FROM adventures WHERE id = ?'

// get all adventure details per an adventure id and type
const selectAdventureByIdGroup = {
  ski: `SELECT
    a.id AS id,
    a.adventure_name AS adventure_name,
    a.adventure_type AS adventure_type,
    a.bio AS bio,
    a.coordinates_lat AS coordinates_lat,
    a.coordinates_lng AS coordinates_lng,
    a.creator_id AS creator_id,
    CONCAT(u.first_name, " ", u.last_name) AS creator_name,
    u.email AS creator_email, a.date_created AS date_created,
    a.nearest_city AS nearest_city,
    a.public AS public,
    a.rating AS rating,
    s.avg_angle AS avg_angle,
    s.trail_path AS path,
    s.elevations AS elevations,
    s.max_angle AS max_angle,
    s.aspect AS aspect,
    a.difficulty AS difficulty,
    s.summit_elevation AS summit_elevation,
    s.base_elevation AS base_elevation,
    s.exposure AS exposure,
    s.season AS season
    FROM adventures AS a
    INNER JOIN ski AS s ON a.adventure_ski_id = s.id
    INNER JOIN users AS u ON a.creator_id = u.id
    WHERE a.id = ?`,
  climb:
    'SELECT a.id AS id, a.difficulty AS difficulty, a.adventure_name AS adventure_name, a.adventure_type AS adventure_type, a.bio AS bio, a.coordinates_lat AS coordinates_lat, a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, CONCAT(u.first_name, " ", u.last_name) AS creator_name, u.email AS creator_email, a.date_created AS date_created, a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, c.first_ascent AS first_ascent, c.pitches AS pitches, c.protection AS protection, c.approach AS approach, c.climb_type AS climb_type, c.season AS season FROM adventures AS a INNER JOIN climb AS c ON a.adventure_climb_id = c.id INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?',
  hike: 'SELECT a.id AS id, a.adventure_name AS adventure_name, a.adventure_type AS adventure_type, a.bio AS bio, a.coordinates_lat AS coordinates_lat, a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, CONCAT(u.first_name, " ", u.last_name) AS creator_name, u.email AS creator_email, a.date_created AS date_created, a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, a.difficulty AS difficulty, h.trail_path AS path, h.elevations AS elevations, h.summit_elevation AS summit_elevation, h.climb AS climb, h.descent AS descent, h.base_elevation AS base_elevation, h.season AS season FROM adventures AS a INNER JOIN hike AS h ON a.adventure_hike_id = h.id INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?',
  bike: 'SELECT a.id AS id, a.adventure_name AS adventure_name, a.adventure_type AS adventure_type, a.bio AS bio, a.coordinates_lat AS coordinates_lat, a.coordinates_lng AS coordinates_lng, a.creator_id AS creator_id, CONCAT(u.first_name, " ", u.last_name) AS creator_name, u.email AS creator_email, a.date_created AS date_created, a.nearest_city AS nearest_city, a.public AS public, a.rating AS rating, a.difficulty AS difficulty, b.trail_path AS path, b.elevations AS elevations, b.summit_elevation AS summit_elevation, b.climb AS climb, b.descent AS descent, b.base_elevation AS base_elevation, b.season AS season FROM adventures AS a INNER JOIN bike AS b ON a.adventure_bike_id = b.id INNER JOIN users AS u ON a.creator_id = u.id WHERE a.id = ?',
  skiApproach: `SELECT
      a.id AS id,
      a.adventure_name AS adventure_name,
      a.adventure_type AS adventure_type,
      a.bio AS bio,
      a.coordinates_lat AS coordinates_lat,
      a.coordinates_lng AS coordinates_lng,
      a.creator_id AS creator_id,
      CONCAT(u.first_name, " ", u.last_name) AS creator_name,
      u.email AS creator_email,
      a.date_created AS date_created,
      a.nearest_city AS nearest_city,
      a.public AS public,
      a.rating AS rating,
      a.difficulty AS difficulty,
      sa.trail_path AS path,
      sa.elevations AS elevations,
      sa.summit_elevation AS summit_elevation,
      sa.base_elevation AS base_elevation,
      sa.gear AS gear,
      sa.exposure AS exposure
      FROM adventures AS a
      INNER JOIN ski_approach AS sa ON a.ski_approach_id = sa.id
      INNER JOIN users AS u ON a.creator_id = u.id
      WHERE a.id = ?`
}
// get adventures by distance within a type
const getCloseAdventures = `SELECT
  id,
  adventure_name,
  adventure_type,
  difficulty,
  rating,
  nearest_city,
  bio
  FROM adventures
  WHERE public = 1 AND adventure_type = ? AND id != ?
  ORDER BY SQRT(POWER(coordinates_lat - ?, 2) + POWER(coordinates_lng - ?, 2)) LIMIT ?`

const getCloseAdventuresGivenZone = `
SELECT
a.id AS adventure_id,
a.adventure_name,
a.adventure_type,
a.difficulty,
a.rating,
a.nearest_city,
a.bio
FROM adventures AS a
LEFT JOIN zone_interactions AS zi ON a.id = zi.adventure_child_id
WHERE public = 1 AND adventure_type = ? AND (zi.parent_id != ? OR zi.parent_id IS NULL) AND a.id != ?
ORDER BY SQRT(POWER(coordinates_lat - ?, 2) + POWER(coordinates_lng - ?, 2)) LIMIT ?`

// get an adventure rating and difficulty
const getAdventureRatingAndDifficulty =
  'SELECT rating, difficulty, id AS adventure_id, adventure_type FROM adventures WHERE id = ?'

// get al adventures pertaining to a given type which don't have a parent zone
const selectAdventuresStatement = `SELECT
a.adventure_type,
a.adventure_name,
a.id AS adventure_id,
a.coordinates_lat,
a.coordinates_lng,
a.public,
s.trail_path AS ski_path,
h.trail_path AS hike_path,
b.trail_path AS bike_path,
sa.trail_path AS ski_approach_path
FROM adventures AS a
LEFT JOIN ski AS s ON a.adventure_ski_id = s.id
LEFT JOIN hike AS h ON a.adventure_hike_id = h.id
LEFT JOIN bike AS b ON a.adventure_bike_id = b.id
LEFT JOIN ski_approach AS sa ON a.ski_approach_id = sa.id
LEFT JOIN zone_interactions AS zi ON zi.adventure_child_id = a.id
WHERE a.adventure_type = ? AND a.public = 1 AND zi.parent_id IS NULL`

const selectSkiApproachStatement = `
  SELECT
  a.id,
  a.adventure_name,
  a.adventure_type,
  a.public,
  a.coordinates_lat,
  a.coordinates_lng,
  sa.trail_path
  FROM adventures AS a
  INNER JOIN ski_approach AS sa ON a.ski_approach_id = sa.id
  WHERE a.adventure_type = "skiApproach" AND public = 1
`
const getSpecificAdventureId = `SELECT
    adventure_type,
    CASE 
    WHEN adventure_type = 'ski' THEN adventure_ski_id
    WHEN adventure_type = 'hike' THEN adventure_hike_id
    WHEN adventure_type = 'bike' THEN adventure_bike_id
    WHEN adventure_type = 'climb' THEN adventure_climb_id
    ELSE ski_approach_id END
    AS specific_adventure_id FROM adventures WHERE id = ?`

const buildBreadcrumbStatement = `
WITH RECURSIVE parents AS (
  SELECT
  a.id AS id,
  a.adventure_type,
  a.adventure_name AS name,
  zi.parent_id
  FROM adventures AS a
  LEFT JOIN zone_interactions AS zi ON a.id = zi.adventure_child_id
  WHERE a.id = ?
  UNION ALL
  SELECT
  z.id AS id,
  z.adventure_type,
  z.zone_name AS name,
  zi.parent_id
  FROM zones AS z
  LEFT JOIN zone_interactions AS zi ON z.id = zi.zone_child_id
  INNER JOIN parents AS p ON p.parent_id = z.id
)
SELECT name, id, adventure_type FROM parents`

module.exports = {
  getAdventureTypeStatement,
  buildBreadcrumbStatement,
  selectAdventureByIdGroup,
  selectSkiApproachStatement,
  getCloseAdventures,
  getCloseAdventuresGivenZone,
  getAdventureRatingAndDifficulty,
  selectAdventuresStatement,
  getSpecificAdventureId
}
