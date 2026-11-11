/**
 * @typedef {Object} UserObject
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {boolean} isPremium
 * @property {string} sex
 * @property {string} user_site
 * @property {string} password
 * @property {string} city
 * @property {string} bio
 * @property {string} profile_picture_url
 * @property {FriendObject[]} friends
 * @property {UserTodo[]} completed_adventures
 * @property {UserTodo[]} todo_adventures
 * @property {Object[]} images
 */

/**
 * @callback FriendEmailCallback
 * @param {string} email
 * @param {string} followingUserName
 * @returns {void}
 */

/**
 * @callback PasswordEmailCallback
 * @param {string} email
 * @param {string} resetToken
 */

/**
 * @typedef {Object} UserTodo
 * @property {number} user_id
 * @property {string} adventure_name
 * @property {string} adventure_type
 * @property {number} adventure_id
 * @property {string} nearest_city
 */

/**
 * @typedef {Object} FriendObject
 * @property {string} display_name
 * @property {number} id
 * @property {string} email
 */

/**
 * @typedef {Object} TodoResponse
 * @property {UserTodo} userTodo
 * @property {AdventureTodo} adventureTodo
 */

/**
 * @typedef {Object} CompletedResponse
 * @property {UserTodo} userCompleted
 * @property {AdventureTodo} adventureCompleted
 */

/**
 * @typedef {Object} NewUserResponse
 * @property {UserObject} user
 * @property {string} token
 */

/**
 * @typedef {Object} MessageObject
 * @property {string} body
 * @property {number} sender
 * @property {number} id
 * @property {number} conversation
 * @property {string} data
 */

/**
 * @typedef {Object} NewConversationReturnType
 * @property {number} conversationId
 * @property {string} conversationName
 */

/**
 * @typedef {Object} ConversationUserType
 * @property {string} display_name
 * @property {number} user_id
 * @property {string} profile_picture_url
 */

/**
 * @typedef {Object} ConversationResponseType
 * @property {ConversationUserType[]} users
 * @property {string} conversation_name
 * @property {number} conversation_id
 * @property {boolean} unread
 */
