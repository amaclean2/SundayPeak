import { Router } from 'express';

import UsersRouter from './Users';
import AdventuresRouter from './Adventures';
import ActivitiesRouter from './Activities';
import TicksRouter from './Ticks';

const router = Router();

router.use('/users', UsersRouter);
router.use('/adventures', AdventuresRouter);
router.use('/activities', ActivitiesRouter);
router.use('/ticks', TicksRouter);

router.get('/verify', (req, res) => {
    res.status(200).json({
        message: 'API up and working. Select a category to query.'
    })
});

export default router;