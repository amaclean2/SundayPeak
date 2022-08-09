import { validationResult } from 'express-validator';
import { addAdventure, getAdventure, getAdventures, getTicksByAdventure } from '../DB';
import { getAdventurePictures } from '../DB/Pictures';
import { returnError } from '../ErrorHandling';
import { CREATED, NO_CONTENT, SUCCESS } from '../ErrorHandling/statuses';

export const buildAdventureObject = async ({ id }) => {
    const adventure = await getAdventure(id);
    const ticks = await getTicksByAdventure({ adventure_id: id });
    const images = await getAdventurePictures({ adventure_id: id });

    return {
        ...adventure,
        images,
        ticks: ticks.map((tick) => ({
            ...tick,
            user_id: tick.creator_id
        }))
    };
};

export const parseCoordinates = ({ boundingBox }) => {
    return {
        maxLat: boundingBox.NE.lat,
        minLat: boundingBox.SW.lat,
        maxLng: boundingBox.NE.lng,
        minLng: boundingBox.SW.lng
    };
};

export const getAllAdventures = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('ERRORS', errors);
        return returnError({ req, res, error: errors.array()[0] });
    }
    
    const { bounding_box, type } = req.body;
    try {
        const parsedCoordinates = parseCoordinates({ boundingBox: bounding_box });
        const adventures = await getAdventures(parsedCoordinates, type, 10)

        res.status(SUCCESS).json({
            data: { adventures }
        });

    } catch (error) {
        throw returnError({ req, res, error, message: 'serverGetAdventures ' });
    }
};

export const getAdventureDetails = async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const adventure = await buildAdventureObject({ id });
            return res.status(SUCCESS).json({ data: { adventure } });
        }

        throw returnError({ req, res, message: 'adventureIdFieldRequired' });

    } catch (error) {
        throw returnError({ req, res, message: 'serverGetAdventureDetails', error });
    }
};

export const createNewAdventure = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('ERRORS', errors);
        return returnError({ req, res, error: errors.array()[0] });
    }

    try {
        const resultId = await addAdventure(req.body);
        const responseBody = req.body;

        responseBody.id = resultId;
        responseBody.coordinates = {
            lat: responseBody.coordinates_lat,
            lng: responseBody.coordinates_lng
        };

        delete responseBody.coordinates_lat;
        delete responseBody.coordinates_lng;


        console.log("ADVENTURE_CREATED", resultId, responseBody);
        res.status(CREATED).json({ data: { adventure: responseBody } });

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateAdventure', error });
    }
};

export const deleteAdventure = async (req, res) => {
    const { adventure_id } = req.query;

    try {
        const deletion_resp = await deleteAdventure(adventure_id);
        console.log("ADVENTURE_DELETED", deletion_resp);

        res.status(NO_CONTENT).json({ data: {} });

    } catch (error) {
        throw returnError({ req, res, message: 'serverDeleteAdventure', error });
    }
};