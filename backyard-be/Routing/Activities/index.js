import { Router } from 'express';
import { createActivity, getActivitiesByAdventure, getActivitiesByUser } from '../../DB';
import { returnError } from '../../ErrorHandling';
import { CREATED, SUCCESS } from '../../ErrorHandling/statuses';

const router = Router();

router.get('/getActivitiesByUser', async (req, res) => {
    try {
        const { id_from_token } = req.body;
        const activities = await getActivitiesByUser({ user_id: id_from_token });

        console.log("ACTIVITIES", activities);

        res.status(SUCCESS).json({
            activities: activities.map((activity) => ({
                ...activity,
                user_id: activity.creator_id
            }))
        });
    } catch (error) {
        throw returnError({ req, res, message: 'serverGetActivities', error });
    }
});

router.get('/getActivitiesByAdventure', async (req, res) => {
    try {
        const { adventure_id } = req.body;
        const activities = await getActivitiesByAdventure({ adventure_id });

        console.log("ACTIVITIES", activities);
        res.status(SUCCESS).json({
            activities: activities.map((activity) => ({
                ...activity,
                user_id: activity.creator_id
            }))
        });
    } catch (error) {
        throw returnError({ req, res, message: 'serverGetActivities', error });
    }
});

router.post('/createActivity', async (req, res) => {
    try {
        const { id_from_token, adventure_id, public: publicField } = req.body;

        if (publicField === true) {
            publicField = 1;
        } else if (publicField === false) {
            publicField = 0;
        }

        if (user_id) {
            await createActivity({ user_id: id_from_token, adventure_id, public: publicField });

            const activityResponse = {
                user_id: id_from_token,
                adventure_id,
                public: publicField
            };

            console.log("ACTIVITY_ADDED", activityResponse);
            res.status(CREATED).json(activityResponse);

        } else {
            throw returnError({ req, res, message: 'notLoggedIn' });
        }

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateActivity', error });
    }
});

export default router;