import {
    getUserById,
    getActivityCountByUser,
    getTicksByUser,
    getUser,
    getFollowerCountLookup,
    getFollowingCountLookup
} from '../DB';
import { returnError } from '../ErrorHandling';

export const buildUserObject = async ({ id, email }) => {

    let userObject;

    if (id) {
        userObject = await getUserById(id);
    } else if (email) {
        userObject = await getUser(email);

        if (!userObject) {
            throw returnError({ message: 'noAccountExists' });
        }
        
        id = userObject.id;
    } else {
        throw returnError({ message: 'missingFieldsFetchUser' });
    }

    if (!userObject) {
        throw returnError({ message: 'noAccountExists' });
    }

    const activityCount = await getActivityCountByUser({ user_id: id }) || 0;
    const ticks = await getTicksByUser({ user_id: id });
    const followerCount = await getFollowerCountLookup({ user_id: id }) || 0;
    const followingCount = await getFollowingCountLookup({ user_id: id }) || 0;

    const returnObj = {
        ...userObject,
        activityCount,
        followerCount,
        followingCount,
        ticks: ticks.map((tick) => ({
            ...tick,
            user_id: tick.creator_id
        }))
    };

    console.log({ returnObj });
    return returnObj;
};