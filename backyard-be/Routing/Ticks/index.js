import { Router } from 'express';
import { getTicksByAdventure } from '../../DB';
import { returnError } from '../../ErrorHandling';
import { CREATED } from '../../ErrorHandling/statuses';
import { tickCreateValidator, tickGetValidatorByAdventure } from '../../Validators/TickValidators';

const router = Router();

router.get('/byAdventure', tickGetValidatorByAdventure, async (req, res) => {
    try {
        const { adventure_id, user_id } = req.body;
        const ticks = await getTicksByAdventure({ adventure_id });

        console.log("TICKS", ticks);
        return ticks.filter((tick) => {
            return tick.creator_id !== user_id;
        }).map((tick) => ({
            ...tick,
            user_id: tick.creator_id
        }));

    } catch (error) {
        throw returnError({ req, res, message: 'serverGetTicksAdventure', error });
    }
});

router.post('/create', tickCreateValidator, async (req, res) => {
    try {
        const { user_id, adventure_id, public: publicField } = req_body;

        await createTick({ user_id, adventure_id, public: publicField });

        const tickResponse = {
            user_id,
            adventure_id,
            public: publicField
        }

        console.log("TICK_ADDED", tickResponse);

        res.status(CREATED).json(tickResponse);

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateTick', error });
    }
});

export default router;