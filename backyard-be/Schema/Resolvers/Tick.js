const { getTicksByAdventure, createTick, getTicksByUser } = require('../../DB');
const { catchBlock, returnError } = require('../../ErrorHandling');

const tickResolvers = {
    Query: {
        getAllTicksByAdventure: async (parent, args, context) => {
            try {
                const { adventure_id } = args;
                const { user_id } = context;
                const ticks = await getTicksByAdventure({ adventure_id });

                console.log("TICKS", ticks);
                return ticks.filter((tick) => {
                    return tick.creator_id !== user_id;
                }).map((tick) => ({
                    ...tick,
                    user_id: tick.creator_id
                }));
            } catch (error) {
                throw catchBlock({ message: 'serverGetTicksAdventure', error });
            }
        },
        getAllTicksByUser: async (parent, args) => {
            try {
                const { user_id } = args;
                const ticks = await getTicksByUser({ user_id });

                console.log("TICKS", ticks);
                return ticks.map((tick) => ({
                    ...tick,
                    user_id: tick.creator_id
                }));
            } catch (error) {
                throw catchBlock({ message: 'serverGetTicks', error });
            }
        }
    },

    Mutation: {
        createTick: async (parent, args, context) => {
            try {
                const { user_id } = context;
                let { adventure_id, public } = args;

                if (public === true) {
                    public = 1;
                } else if (public === false) {
                    public = 0;
                }

                if (user_id) {
                    const insertId = await createTick({ user_id, adventure_id, public });

                    const tickResponse = {
                        user_id,
                        adventure_id,
                        public,
                        id: insertId
                    }

                    console.log("TICK_ADDED", tickResponse);
                    return tickResponse;
                } else {
                    throw returnError({ message: 'notLoggedIn' });
                }

            } catch (error) {
                throw catchBlock({ message: 'serverCreateTick', error });
            }
        }
    }
};

module.exports = {
    tickResolvers
};