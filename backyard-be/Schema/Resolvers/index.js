const { userResolvers } = require('./User');
const { lineResolvers } = require('./Line');
const { activityResolvers } = require('./Activity');
const { tickResolvers } = require*('./Tick');

const resolvers = { ...userResolvers, ...lineResolvers, ...activityResolvers, ...tickResolvers };

module.exports = resolvers;