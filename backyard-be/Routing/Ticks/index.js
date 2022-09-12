const { Router } = require('express');
const { validationResult } = require('express-validator');
const queries = require('../../DB');
const { returnError } = require('../../ResponseHandling');
const { CREATED, NOT_FOUND } = require('../../ResponseHandling/statuses');
const { buildUserObject } = require('../../Services/user.service');
const { tickCreateValidator } = require('../../Validators/TickValidators');

const router = Router();

router.post('/create', tickCreateValidator(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return returnError({ req, res, error: errors.array()[0] });
    }

    try {
        const { user_id, adventure_id, public: publicField } = req.body;

        await queries.createTick({ user_id, adventure_id, public: publicField });

        const newUserObj = await buildUserObject({ req, res, initiation: { id: user_id } });
        delete newUserObj.password;

        res.status(CREATED).json({
            data: {
                user: newUserObj
            }
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateTick', error });
    }
});

router.use('/', (req, res) => {
    res.status(NOT_FOUND).json({
        data: {
            messasge: 'Please select a method on /ticks',
            status: NOT_FOUND
        }
    });
});

module.exports = router;