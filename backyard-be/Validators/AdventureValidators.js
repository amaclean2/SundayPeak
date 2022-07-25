import { returnError } from '../ErrorHandling';

export const validateCreateAdventure = async (req, res, next) => {

    const adventure = req.body;

    const {
        adventure_type,
        adventure_name,
        id_from_token,
        coordinates,
    } = adventure;

    const parsedCoordinates = JSON.parse(coordinates);

    if (!adventure_type) {
        throw returnError({ req, res, message: 'adventureType' });
    } else if (!id_from_token) {
        throw returnError({ req, res, message: 'creatorId' });
    } else if (!parsedCoordinates?.lat || !parsedCoordinates?.lng) {
        throw returnError({ req, res, message: 'coordinates' });
    } else if (!adventure_name) {
        throw returnError({ req, res, message: 'adventureName' });
    } else {
        adventure.creator_id = adventure.id_from_token;
        delete adventure.id_from_token;

        adventure.coordinates_lat = parsedCoordinates.lat;
        adventure.coordinates_lng = parsedCoordinates.lng;
        delete adventure.coordinates;

        req.body = adventure;
        return next();
    }
};