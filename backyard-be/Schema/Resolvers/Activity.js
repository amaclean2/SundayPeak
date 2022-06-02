const Activities = require('../../SampleData/ActivityData.json');

const activityResolvers = {
    Query: {
        getAllActivitiesForLine: (parent, args) => {
            const { line_id } = args;
            return Activities;
        },
        getAllActivitiesForUser: (parent, args) => {
            const { user_id } = args;
            return Activities;
        }
    },

    Mutation: {
        createActivity: (parent, args) => {
            const newActivity = args;
            Activities.push(newActivity);

            return newActivity;
        }
    }
};

module.exports = {
    activityResolvers
};