import { Router } from 'express';
import { validationResult } from 'express-validator';

import { CREATED, SUCCESS } from '../../ErrorHandling/statuses';
import { returnError } from '../../ErrorHandling';
import { getAdventures, addAdventure } from '../../DB';
import { getMapboxAccessToken } from '../../Config/connections.js';
import { adventureCreateValidator } from '../../Validators/AdventureValidators';
import { buildAdventureObject } from '../../Handlers/Adventures';

const router = Router();

router.get('/all', async (req, res) => {
    const { lat, lng, type, zoom } = req.query;
    const parsedCoordinates = { lat, lng };

    try {
        const adventures = await getAdventures(parsedCoordinates, 'line', 10)
        const mapboxToken = getMapboxAccessToken();

        res.status(SUCCESS).json({
            data: {
                adventures,
                mapboxToken
            }
        });

    } catch (error) {
        throw returnError({ req, res, error, message: 'serverGetAdventures ' });
    }
});

router.get('/details', async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const adventure = await buildAdventureObject({ id });
            res.status(SUCCESS).json({ data: { adventure } });
        }

        throw returnError({ req, res, message: 'adventureIdFieldRequired' });

    } catch (error) {
        throw returnError({ req, res, message: 'serverGetAdventureDetails', error });
    }
});

router.post('/create', adventureCreateValidator(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('ERRORS', errors);
        return returnError({ req, res, error: errors.array()[0] });
    }

    try {
        const resultId = await addAdventure(req.body);
        req.body.id = resultId;

        console.log("ADVENTURE_CREATED", resultId, req.body);
        res.status(CREATED).json({ data: { adventure: req.body } });

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateAdventure', error });
    }
});

router.put('/edit', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

router.delete('/delete', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

export default router;