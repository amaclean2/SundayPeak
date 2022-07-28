import { Router } from 'express';
import { createActivity, getActivitiesByAdventure, getActivitiesByUser } from '../../DB';
import { returnError } from '../../ErrorHandling';
import { CREATED, SUCCESS } from '../../ErrorHandling/statuses';
import { activityCreateValidator, activityGetValidatorByAdventure } from '../../Validators/ActivityValidators';

const router = Router();

router.get('/byUser', async (req, res) => {
    try {
        const { user_id } = req.body;
        const activities = await getActivitiesByUser({ user_id });

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

router.get('/byAdventure', activityGetValidatorByAdventure, async (req, res) => {
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

router.post('/create', activityCreateValidator, async (req, res) => {
    try {
        const { user_id, adventure_id, public: publicField } = req.body;

        await createActivity({ user_id, adventure_id, public: publicField });

        const activityResponse = {
            user_id: id_from_token,
            adventure_id,
            public: publicField
        };

        console.log("ACTIVITY_ADDED", activityResponse);
        res.status(CREATED).json(activityResponse);

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateActivity', error });
    }
});

export default router;