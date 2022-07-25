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

export default router;