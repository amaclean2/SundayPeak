const { getTicksByAdventure } = require('../../DB');
const Ticks = require('../../SampleData/TickData.json');

const tickResolvers = {
    Query: {
        getAllTicksByAdventure: async (parent, args) => {
            try {
                const { adventure_id } = args;
                return await getTicksByAdventure({ adventure_id });
            } catch (error) {
                console.log("SERVER_ERROR", error);
                throw error;
            }
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