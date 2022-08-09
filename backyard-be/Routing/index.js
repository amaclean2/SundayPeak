import { Router } from 'express';

import UsersRouter from './Users';
import AdventuresRouter from './Adventures';
import ActivitiesRouter from './Activities';
import TicksRouter from './Ticks';
import PicturesRouter from './Pictures';
import { getLoggedInUser } from '../Handlers/Users';
import { getMapboxAccessToken } from '../Config/connections';
import { SUCCESS } from '../ErrorHandling/statuses';

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

router.use('/users', UsersRouter);
router.use('/adventures', AdventuresRouter);
router.use('/activities', ActivitiesRouter);
router.use('/ticks', TicksRouter);
router.use('/pictures', PicturesRouter);

router.get('/verify', (req, res) => {
    res.status(200).json({
        message: 'API up and working. Select a category to query.'
    })
});

export default router;