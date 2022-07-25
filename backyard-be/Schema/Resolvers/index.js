import { userResolvers } from './User.js';
import { adventureResolvers } from './Adventure.js';
import { activityResolvers } from './Activity.js';
import { tickResolvers } from './Tick.js';

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

export default resolvers;