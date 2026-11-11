/**
 * @typedef {Object} AdventureObject
 * @property {string} adventure_type
 * @property {string} adventure_name
 * @property {string} nearest_city
 * @property {boolean} public
 * @property {string} creator_id
 * @property {string} coordinates_lat
 * @property {string} coordinates_lng
 * @property {AdventureTodo[]} todo_users
 * @property {AdventureTodo[]} completed_users
 */

/**
 * @typedef {Object} GeoJsonAdventure
 * @property {string} type
 * @property {Object} geometry
 * @property {string} geometry.type
 * @property {number[]} geometry.coordinates
 * @property {Object} properties
 * @property {number} properties.id
 * @property {string} properties.adventure_name
 * @property {string} properties.adventure_type
 * @property {boolean} properties.public
 */

/**
 * @typedef {Object} AdventureGeoJsonObject
 * @property {string} type
 * @property {GeoJsonAdventure[]} features
 */

/**
 * @typedef {Object} AdventureTodo
 * @property {string} display_name
 * @property {string} email
 * @property {string} profile_picture_url
 * @property {number} user_id
 */

/**
 * @typedef {Object} DeletionResponse
 * @property {number} affectedRows
 */
