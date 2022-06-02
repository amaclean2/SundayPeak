const { userResolvers } = require('./User');
const { lineResolvers } = require('./Line');
const { activityResolvers } = require('./Activity');
const { tickResolvers } = require('./Tick');

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...lineResolvers.Query,
        ...activityResolvers.Query,
        ...tickResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...lineResolvers.Mutation,
        ...activityResolvers.Mutation,
        ...tickResolvers.Mutation
    }
};

module.exports = resolvers;