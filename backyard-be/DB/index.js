const userActions = require('./User');
const adventureActions = require('./Adventure');
const tickActions = require('./Tick');
const activityActions = require('./Activity');

module.exports = {
    ...userActions,
    ...adventureActions,
    ...tickActions,
    ...activityActions
};