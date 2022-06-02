const Ticks = require('../../SampleData/TickData.json');

const tickResolvers = {
    Query: {
        getAllTicksForLine: (parent, args) => {
            const { line_id } = args;
            return Ticks;
        },
        getAllTicksForUser: (parent, args) => {
            const { user_id } = args;
            return Ticks;
        }
    },

    Mutation: {
        createTick: (parent, args) => {
            const newTick = args;
            Ticks.push(newTick);

            return newTick;
        }
    }
};

module.exports = {
    tickResolvers
};