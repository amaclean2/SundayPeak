import { Router } from 'express';
import { CREATED, SUCCESS } from '../../ErrorHandling/statuses';
import { returnError } from '../../ErrorHandling';
import { getAdventures, addAdventure, getAdventure } from '../../DB';
import { getMapboxAccessToken } from '../../Config/connections.js';
import { validateCreateAdventure } from '../../Validators/AdventureValidators';

const router = Router();

router.get('/allAdventures', async (req, res) => {
    const { coordinates, type, zoom } = req.body;
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

router.get('/adventureDetails', async (req, res) => {
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

router.post('/createAdventure', validateCreateAdventure, async (req, res) => {
    try {
        const resultId = await addAdventure(req.body);

        console.log("ADVENTURE_CREATED", resultId, validationResponse);
        validationResponse.id = resultId;
        res.status(CREATED).json(validationResponse);

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateAdventure', error });
    }
});

router.put('/editAdventure', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

router.delete('/deleteAdventure', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

export default router;