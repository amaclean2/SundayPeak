const { validationResult } = require('express-validator');
const logger = require('../Config/logger');
const queries = require('../DB');
const { returnError } = require('../ResponseHandling');
const { SUCCESS, NO_CONTENT, CREATED } = require('../ResponseHandling/statuses');

const buildAdventureObject = async ({ id }) => {
    const {
        getAdventure,
        getTicksByAdventure,
        getAdventurePictures
    } = queries;

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

const parseCoordinates = ({ boundingBox }) => {
    return {
        maxLat: boundingBox.NE.lat,
        minLat: boundingBox.SW.lat,
        maxLng: boundingBox.NE.lng,
        minLng: boundingBox.SW.lng
    };
};

const getAllAdventures = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return returnError({ req, res, error: errors.array()[0] });
    }

    const { bounding_box, type } = req.body;
    try {
        const parsedCoordinates = parseCoordinates({ boundingBox: bounding_box });
        const adventures = await queries.getAdventures(parsedCoordinates, type, 10)

        res.status(SUCCESS).json({
            data: { adventures }
        });

    } catch (error) {
        throw returnError({ req, res, error, message: 'serverGetAdventures ' });
    }
};

const getAdventureDetails = async (req, res) => {
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

const createNewAdventure = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return returnError({ req, res, error: errors.array()[0] });
    }

    try {
        const resultId = await queries.addAdventure(req.body);
        const responseBody = req.body;

        responseBody.id = resultId;
        responseBody.coordinates = {
            lat: responseBody.coordinates_lat,
            lng: responseBody.coordinates_lng
        };

        delete responseBody.coordinates_lat;
        delete responseBody.coordinates_lng;

        logger.debug('ADVNETURE_CREATED', resultId, responseBody);
        res.status(CREATED).json({ data: { adventure: responseBody } });

    } catch (error) {
        throw returnError({ req, res, message: 'serverCreateAdventure', error });
    }
};

const deleteAdventure = async (req, res) => {
    const { adventure_id } = req.query;

    try {
        const deletion_resp = await queries.deleteAdventure(adventure_id);
        logger.debug('ADVENTURE_DELETED', deletion_resp);

        res.status(NO_CONTENT).json({ data: {} });

    } catch (error) {
        throw returnError({ req, res, message: 'serverDeleteAdventure', error });
    }
};

module.exports = {
    buildAdventureObject,
    parseCoordinates,
    getAllAdventures,
    getAdventureDetails,
    createNewAdventure,
    deleteAdventure
};