const { userResolvers } = require('./User');
const { adventureResolvers } = require('./Adventure');
const { activityResolvers } = require('./Activity');
const { tickResolvers } = require('./Tick');

const resolvers = {
    Query: {
        ...userResolvers?.Query,
        ...adventureResolvers?.Query,
        ...activityResolvers?.Query,
        ...tickResolvers?.Query
    },
    Mutation: {
        ...userResolvers?.Mutation,
        ...adventureResolvers?.Mutation,
        ...activityResolvers?.Mutation,
        ...tickResolvers?.Mutation
    }
};

module.exports = resolvers;