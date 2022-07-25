import { Router } from 'express';
import { NOT_FOUND } from '../ErrorHandling/statuses.js';

const router = Router();

router.use('', (req, res) => {
    res.status(NOT_FOUND).json({
        message: "No external routes are currently set up."
    });
});

export default router;