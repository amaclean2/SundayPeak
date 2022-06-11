const userActions = require('./User');
const adventureActions = require('./Adventure');

module.exports = {
    ...userActions,
    ...adventureActions
};