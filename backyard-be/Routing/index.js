const { Router } = require('express');

const usersRouter = require('./Users');
const adventuresRouter = require('./Adventures');
const activitiesRouter = require('./Activities');
const ticksRouter = require('./Ticks');
const picturesRouter = require('./Pictures');
const { getLoggedInUser } = require('../Handlers/Users');
const { getMapboxAccessToken } = require('../Config/connections');
const { SUCCESS } = require('../ResponseHandling/statuses');

const router = Router();

router.get('/initial', (req, res) => {
    if (req.body.id_from_token) return getLoggedInUser(req, res);
    else {
        res.status(SUCCESS).json({
            data: {
                user: false,
                mapbox_token: getMapboxAccessToken()
            }
        });
    }
});

router.use('/users', usersRouter);
router.use('/adventures', adventuresRouter);
router.use('/activities', activitiesRouter);
router.use('/ticks', ticksRouter);
router.use('/pictures', picturesRouter);

router.get('/verify', (req, res) => {
    res.status(200).json({
        message: 'API up and working. Select a category to query.'
    })
});

module.exports = router;