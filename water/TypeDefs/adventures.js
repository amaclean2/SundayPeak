/**
 * @typedef {Object} AdventureObject
 * @property {string} adventure_type
 * @property {string} adventure_name
 * @property {string} nearest_city
 * @property {string} public
 * @property {string} creator_id
 * @property {string} coordinates_lat
 * @property {string} coordinates_lng
 * @property {AdventureTodo[]} todo_users
 * @property {AdventureTodo[]} completed_users
 */

/**
 * @typedef {Object} AdventureGeoJsonObject
 * @property {string} type
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
