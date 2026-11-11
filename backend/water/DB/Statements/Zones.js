// Get zone information
const getZoneInformationQuery = `SELECT
z.zone_name AS zone_name,
z.id AS id,
z.adventure_type AS adventure_type,
z.bio AS bio,
z.approach AS approach,
z.nearest_city AS nearest_city,
z.coordinates_lat AS coordinates_lat,
z.coordinates_lng AS coordinates_lng,
z.date_created AS date_created,
u.id AS creator_id,
CONCAT(u.first_name, ' ', u.last_name) AS creator_name,
u.email AS creator_email,
u.profile_picture_url AS profile_picture_url
FROM zones AS z
INNER JOIN users AS u ON z.creator_id = u.id
WHERE z.id = ?`

// Get all the top level zones of an adventure type
const getAllZonesOfATypeQuery = `
SELECT
z.id,
z.zone_name,
z.adventure_type,
z.coordinates_lat,
z.coordinates_lng,
zi.parent_id
FROM zones AS z
LEFT JOIN zone_interactions AS zi ON zi.zone_child_id = z.id
WHERE adventure_type = ? AND zi.parent_id IS NULL`

// Get zone adventures
const getZoneAdventuresQuery = `
SELECT
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
FROM zones AS z 
INNER JOIN zone_interactions AS zi ON zi.parent_id = z.id
INNER JOIN adventures AS a ON zi.adventure_child_id = a.id
LEFT JOIN ski AS s ON a.adventure_ski_id = s.id
LEFT JOIN hike AS h ON a.adventure_hike_id = h.id
LEFT JOIN bike AS b ON a.adventure_bike_id = b.id
LEFT JOIN ski_approach AS sa ON a.ski_approach_id = sa.id
WHERE zi.interaction_type = 'adventure' AND z.id = ? AND a.public = 1`

// Get zone first layer subzones
const getZoneSubzoneQuery = `
SELECT
z2.id AS zone_id,
z2.adventure_type,
z2.zone_name,
z2.id AS zone_child_id,
z2.coordinates_lat,
z2.coordinates_lng,
z2.public
FROM zones AS z
INNER JOIN zone_interactions AS zi ON zi.parent_id = z.id
INNER JOIN zones AS z2 ON zi.zone_child_id = z2.id
WHERE zi.interaction_type = 'zone' AND z.id = ? AND z2.public = 1`

// Get zones by distance
const getCloseZonesQuery = `SELECT
  z.id AS zone_id,
  z.zone_name,
  z.adventure_type,
  z.coordinates_lat,
  z.coordinates_lng,
  z.nearest_city,
  z.bio
  FROM zones AS z
  WHERE public = 1 AND adventure_type = ? AND z.id != ?
  ORDER BY SQRT(POWER(coordinates_lat - ?, 2) + POWER(coordinates_lng - ?, 2)) LIMIT ?`

// Get zones by distance, excuding child and current zone
const getCloseSubzonesQuery = `
SELECT
  z.id AS zone_id,
  z.zone_name,
  z.adventure_type,
  z.coordinates_lat,
  z.coordinates_lng,
  z.nearest_city,
  z.bio
  FROM zones AS z
  LEFT JOIN zone_interactions AS zi ON zi.zone_child_id = z.id
  WHERE public = 1 AND adventure_type = ? AND (zi.parent_id != ? OR zi.parent_id IS NULL) AND z.id != ? AND z.id != ?
  ORDER BY SQRT(POWER(coordinates_lat - ?, 2) + POWER(coordinates_lng - ?, 2)) LIMIT ?`

// Get any parent of a zone
const getZoneParentQuery =
  'SELECT parent_id AS id FROM zone_interactions WHERE zone_child_id = ?'

// Get the intersecting adventure types between an adventure and a zone
const intersectingAdventureQuery =
  'SELECT z.adventure_type AS zone_adventure_type, a.adventure_type AS adventure_type FROM zones AS z INNER JOIN adventures AS a ON a.id = ? WHERE z.id = ?'

// Get the insersecting zone types between two zones
const intersectingZoneQuery =
  'SELECT DISTINCT adventure_type FROM zones WHERE id IN (?, ?);'

// Create a zone
const createZoneQuery =
  'INSERT INTO zones (zone_name, adventure_type, coordinates_lat, coordinates_lng, creator_id, nearest_city, public) VALUES ?'

// Add an adventure to a zone
const addAdventureToZoneQuery =
  'REPLACE INTO zone_interactions (adventure_child_id, parent_id, interaction_type) VALUES ?'

// Add a child zone to a zone
const addZoneToZoneQuery =
  'REPLACE INTO zone_interactions (zone_child_id, parent_id, interaction_type) VALUES ?'

// Remove an adventure from a zone
const removeAdventureFromZoneQuery =
  'DELETE FROM zone_interactions WHERE adventure_child_id IN ?'

// Remove a zone from a zone
const removeZoneFromZoneQuery =
  'DELETE FROM zone_interactions WHERE zone_child_id IN ?'

// Edit a zone field
const editZoneFieldQuery = 'UPDATE `zones` SET ?? = ? WHERE id = ?'

// Delete a zone (probably shouldn't do this will-nilly)
const deleteZoneQuery = 'DELETE FROM zones WHERE id = ?'

// Delete a zone interaction
const deleteZoneInteractionsQuery =
  'DELETE FROM zone_interactions WHERE parent_id = ? OR zone_child_id = ?'

// Build the breadcrumb for a zone
const buildBreadcrumbQuery = `
WITH RECURSIVE parents AS (
  SELECT
  z.id AS id,
  z.adventure_type,
  z.zone_name,
  zi.parent_id
  FROM zones AS z
  LEFT JOIN zone_interactions AS zi ON z.id = zi.zone_child_id
  WHERE z.id = ?
  UNION ALL
  SELECT
  z.id AS id,
  z.adventure_type,
  z.zone_name,
  zi.parent_id
  FROM zones AS z
  LEFT JOIN zone_interactions AS zi ON z.id = zi.zone_child_id
  INNER JOIN parents AS p ON p.parent_id = z.id
)
SELECT zone_name AS name, id, adventure_type FROM parents;`

module.exports = {
  getZoneInformationQuery,
  getAllZonesOfATypeQuery,
  getZoneAdventuresQuery,
  getZoneSubzoneQuery,
  getCloseZonesQuery,
  getCloseSubzonesQuery,
  buildBreadcrumbQuery,
  getZoneParentQuery,
  intersectingAdventureQuery,
  intersectingZoneQuery,
  createZoneQuery,
  addAdventureToZoneQuery,
  addZoneToZoneQuery,
  removeAdventureFromZoneQuery,
  removeZoneFromZoneQuery,
  editZoneFieldQuery,
  deleteZoneQuery,
  deleteZoneInteractionsQuery
}
