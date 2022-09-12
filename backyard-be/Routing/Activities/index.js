const { Router } = require('express');
const { validationResult } = require('express-validator');
const queries = require('../../DB');
const { returnError } = require('../../ResponseHandling');
const { CREATED, NOT_FOUND, SUCCESS } = require('../../ResponseHandling/statuses');
const { buildUserObject } = require('../../Services/user.service');
const { activityCreateValidator, activityGetValidatorByAdventure } = require('../../Validators/ActivityValidators');

const router = Router();

router.get('/byUser', async (req, res) => {
    try {
        const { user_id } = req.body;
        const activities = await queries.getActivitiesByUser({ user_id });

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
        return returnError({ req, res, error: errors.array()[0] });
    }

    try {
        const { adventure_id } = req.body;
        const activities = await queries.getActivitiesByAdventure({ adventure_id });

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

        await queries.createActivity({ user_id, adventure_id, public: publicField });

        const newUserObj = await buildUserObject({ req, res, initiation: { id: user_id } });
        delete newUserObj.password;

        res.status(CREATED).json({
            data: { user: newUserObj }
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateActivity', error });
    }
});

router.use('/', (req, res) => {
    res.status(NOT_FOUND).json({
        data: {
            messasge: 'Please select a method on /activities',
            status: NOT_FOUND
        }
    });
});

module.exports = router;