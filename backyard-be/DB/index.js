const userActions = require('./User');
const adventureActions = require('./Adventure');
const tickActions = require('./Ticks');

module.exports = {
    ...userActions,
    ...adventureActions,
    ...tickActions
};