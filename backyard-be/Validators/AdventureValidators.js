import { returnError } from '../ErrorHandling';

export const validateCreateAdventure = async (adventure) => {

    if (adventure.input) {
        adventure = {
            ...adventure,
            ...adventure.input
        };

        delete adventure.input;
    }

    const {
        adventure_type,
        adventure_name,
        creator_id,
        coordinates,
    } = adventure;

    const parsedCoordinates = JSON.parse(coordinates);

    if (!adventure_type) {
        throw returnError({ message: 'adventureType' });
    } else if (!creator_id) {
        throw returnError({ message: 'creatorId' });
    } else if (!parsedCoordinates?.lat || !parsedCoordinates?.lng) {
        throw returnError({ message: 'coordinates' });
    } else if (!adventure_name) {
        throw returnError({ message: 'adventureName' });
    } else {
        adventure.coordinates_lat = parsedCoordinates.lat;
        adventure.coordinates_lng = parsedCoordinates.lng;
        delete adventure.coordinates;

        return adventure;
    }
};