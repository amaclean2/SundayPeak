import { Router } from 'express';

import UsersRouter from './Users';
import AdventuresRouter from './Adventures';
import ActivitiesRouter from './Activities';
import TicksRouter from './Ticks';

const router = Router();

const usersMiddleware = (req, res, next) => {
    console.log(req.body);
    next();
}

router.use('/users', usersMiddleware,  UsersRouter);
router.use('/adventures', AdventuresRouter);
router.use('/activities', ActivitiesRouter);
router.use('/ticks', TicksRouter);

router.get('/verify', (req, res) => {
    res.status(200).json({
        message: 'API up and working. Select a category to query.'
    })
});

export default router;