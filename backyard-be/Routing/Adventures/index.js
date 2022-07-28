import { Router } from 'express';
import { CREATED, SUCCESS } from '../../ErrorHandling/statuses';
import { returnError } from '../../ErrorHandling';
import { getAdventures, addAdventure, getAdventure } from '../../DB';
import { getMapboxAccessToken } from '../../Config/connections.js';
import { adventureCreateValidator } from '../../Validators/AdventureValidators';

const router = Router();

router.get('/all', async (req, res) => {
    const { coordinates, type, zoom } = req.query;
    const parsedCoordinates = JSON.parse(coordinates);

    try {
        const adventures = await getAdventures(parsedCoordinates, 'line', 10)
        const mapboxToken = getMapboxAccessToken();

        res.status(SUCCESS).json({
            adventures,
            mapboxToken
        });

    } catch (error) {
        throw returnError({ req, res, error, message: 'serverGetAdventures ' });
    }
});

router.get('/details', async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const adventure = await getAdventure(id);
            res.status(SUCCESS).json({ adventure });
        }

        throw returnError({ req, res, message: 'adventureIdFieldRequired' });

    } catch (error) {
        throw returnError({ req, res, message: 'serverGetAdventureDetails', error });
    }
});

router.post('/create', adventureCreateValidator, async (req, res) => {
    try {
        const resultId = await addAdventure(req.body);

        console.log("ADVENTURE_CREATED", resultId, validationResponse);
        validationResponse.id = resultId;
        res.status(CREATED).json(validationResponse);

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