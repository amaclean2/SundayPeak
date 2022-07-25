import { Router } from 'express';
import { getTicksByAdventure } from '../../DB';
import { returnError } from '../../ErrorHandling';
import { CREATED } from '../../ErrorHandling/statuses';

const router = Router();

router.get('/getTicksByAdventure', async (req, res) => {
    try {
        const { adventure_id, id_from_token } = req.body;
        const ticks = await getTicksByAdventure({ adventure_id });

        console.log("TICKS", ticks);
        return ticks.filter((tick) => {
            return tick.creator_id !== id_from_token;
        }).map((tick) => ({
            ...tick,
            user_id: tick.creator_id
        }));

    } catch (error) {
        throw returnError({ req, res, message: 'serverGetTicksAdventure', error });
    }
});

router.post('/createTick', async (req, res) => {
    try {
        const { id_from_token, adventure_id, public: publicField } = req_body;

        if (publicField === true) {
            publicField = 1;
        } else if (publicField === false) {
            publicField = 0;
        }

        if (user_id) {
            await createTick({ user_id: id_from_token, adventure_id, public: publicField });

            const tickResponse = {
                user_id: id_from_token,
                adventure_id,
                public: publicField
            }

            console.log("TICK_ADDED", tickResponse);

            res.status(CREATED).json(tickResponse);
        } else {
            throw returnError({ req, res, message: 'notLoggedIn' });
        }

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateTick', error });
    }
});

export default router;