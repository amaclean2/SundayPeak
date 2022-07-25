import {
    getActivitiesByAdventure,
    getActivitiesByUser,
    createActivity,
    getActivityCountByUser
} from '../../DB';
import { catchBlock, returnError } from '../../ErrorHandling';

export const activityResolvers = {
    Query: {
        getAllActivitiesByAdventure: async (parent, args) => {
            try {
                const { adventure_id } = args;
                const activities = await getActivitiesByAdventure({ adventure_id });

                console.log("ACTIVITIES", activities);
                return activities.map((activity) => ({
                    ...activity,
                    user_id: activity.creator_id
                }));
            } catch (error) {
                throw catchBlock({ message: 'serverGetActivities', error });
            }
        },
        getAllActivitiesByUser: async (parent, args) => {
            try {
                const { user_id } = args;
                const activities = await getActivitiesByUser({ user_id });

                console.log("ACTIVITIES", activities);
                return activities.map((activity) => ({
                    ...activity,
                    user_id: activity.creator_id
                }));
            } catch (error) {
                throw catchBlock({ message: 'serverGetActivities', error });
            }
        },
        getAllActivityCountByUser: async (parent, args) => {
            try {
                const { user_id } = args;
                const activityCount = await getActivityCountByUser({ user_id });

                console.log("ACTIVITY_COUNT", activityCount);
                return { count: activityCount };
            } catch (error) {
                throw catchBlock({ message: 'serverGetActivities', error });
            }
        }
    },

    Mutation: {
        createActivity: async (parent, args, context) => {
            try {
                const { user_id } = context;
                let { adventure_id, public: publicField } = args;

                if (publicField === true) {
                    publicField = 1;
                } else if (publicField === false) {
                    publicField = 0;
                }

                if (user_id) {
                    await createActivity({ user_id, adventure_id, public: publicField });

                    const activityResponse = {
                        user_id,
                        adventure_id,
                        public: publicField
                    };

                    console.log("ACTIVITY_ADDED", activityResponse);
                    return activityResponse;
                } else {
                    throw returnError({ message: 'notLoggedIn' });
                }

            } catch (error) {
                throw catchBlock({ message: 'serverCreateActivity', error });
            }
        }
    }
};