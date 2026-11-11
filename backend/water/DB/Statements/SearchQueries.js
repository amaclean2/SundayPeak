// search users

// search users that aren't the current user
const searchUserQuery = `
SELECT
id AS user_id,
CONCAT(first_name, ' ', last_name) AS display_name,
email,
profile_picture_url
FROM users
WHERE MATCH(first_name, last_name, email, phone, user_site, city, bio)
AGAINST(?)
AND id != ?`

// search users within friends
const searchUsersWithinFriendsQuery = `
SELECT
u.id AS user_id,  
CONCAT(u.first_name, ' ', u.last_name) AS display_name,
u.email,
u.profile_picture_url
FROM users AS u
INNER JOIN friends AS r ON (u.id = r.follower_id OR u.id = r.leader_id)
WHERE 
MATCH(first_name, last_name, email, phone, user_site, city, bio)
AGAINST(?)
AND (r.follower_id = ? OR r.leader_id = ?)
AND u.id != ?`

// search adventures

// search adventures that aren't the current adventure
const searchAdventureQuery = `
SELECT
id AS adventure_id,
adventure_name,
adventure_type,
nearest_city
FROM adventures
WHERE MATCH(adventure_name, bio, nearest_city)
AGAINST(?)`

// search adventures that aren't in the current zone
const searchAdventuresNotInZoneQuery = `
SELECT
a.id AS adventure_id,
a.adventure_name,
a.adventure_type,
a.nearest_city
FROM adventures AS a
LEFT JOIN zone_interactions AS zi ON zi.adventure_child_id = a.id
WHERE MATCH(a.adventure_name, a.bio, a.nearest_city)
AGAINST(?)
AND (zi.parent_id != ? OR zi.parent_id IS NULL)`

// search zones
const searchZoneQuery = `
SELECT
z.id AS zone_id,
z.zone_name,
z.adventure_type,
z.nearest_city
FROM zones AS z
WHERE MATCH(z.zone_name, z.bio, z.nearest_city)
AGAINST(?)`

// search zones that aren't in the current zone
const searchZonesNotInZoneQuery = `
SELECT
z.id AS zone_id,
z.zone_name,
z.adventure_type,
z.nearest_city
FROM zones AS z
LEFT JOIN zone_interactions AS zi ON zi.zone_child_id = z.id
WHERE MATCH(z.zone_name, z.bio, z.nearest_city)
AGAINST(?)
AND z.id != ?
AND (zi.parent_id != ? OR zi.parent_id IS NULL)`

module.exports = {
  searchUserQuery,
  searchUsersWithinFriendsQuery,
  searchAdventureQuery,
  searchAdventuresNotInZoneQuery,
  searchZoneQuery,
  searchZonesNotInZoneQuery
}
