const userQueries = require('./User');
const adventureQueries = require('./Adventure');
const tickQueries = require('./Tick.js');
const activityQueries = require('./Activity');
const pictureQueries = require('./Pictures');

const queries = {
    ...userQueries,
    ...adventureQueries,
    ...tickQueries,
    ...activityQueries,
    ...pictureQueries
};

module.exports = queries;