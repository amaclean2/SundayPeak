import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createActivity, getActivitiesByAdventure, getActivitiesByUser } from '../../DB';
import { returnError } from '../../ErrorHandling';
import { CREATED, SUCCESS } from '../../ErrorHandling/statuses';
import { buildUserObject } from '../../Handlers/Users';
import { activityCreateValidator, activityGetValidatorByAdventure } from '../../Validators/ActivityValidators';

const router = Router();

router.get('/byUser', async (req, res) => {
    try {
        const { user_id } = req.body;
        const activities = await getActivitiesByUser({ user_id });

        console.log('ACTIVITIES', activities);

        res.status(SUCCESS).json({
            activities: activities.map((activity) => ({
                data: {
                    ...activity,
                    user_id: activity.creator_id
                }
            }))
        });
    } catch (error) {
        throw returnError({ req, res, message: 'serverGetActivities', error });
    }
});

router.get('/byAdventure', activityGetValidatorByAdventure(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('ERRORS', errors);
        return returnError({ req, res, error: errors.array()[0] });
    }

    try {
        const { adventure_id } = req.body;
        const activities = await getActivitiesByAdventure({ adventure_id });

        console.log('ACTIVITIES', activities);
        res.status(SUCCESS).json({
            activities: activities.map((activity) => ({
                data: {
                    ...activity,
                    user_id: activity.creator_id
                }
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

        const newUserObj = await buildUserObject({ id: user_id });
        delete newUserObj.password;

        console.log('ACTIVITY_ADDED', newUserObj);
        res.status(CREATED).json({
            data: { user: newUserObj }
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateActivity', error });
    }
});

export default router;