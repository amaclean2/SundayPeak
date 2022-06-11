const { UserInputError } = require("apollo-server-express");
const errorTexts = require("../ResponseText/errors");

const validateCreateAdventure = async (adventure) => {
    const {
        adventure_type,
        adventure_name,
        creator_id,
        coordinates,
    } = adventure;

    const parsedCoordinates = JSON.parse(coordinates);

    if (!adventure_type) {
        throw new UserInputError(errorTexts.adventureType);
    } else if (!creator_id) {
        throw new UserInputError(errorTexts.creatorId);
    } else if (!parsedCoordinates?.lat || !parsedCoordinates?.lng) {
        throw new UserInputError(errorTexts.coordinates);
    } else if (!adventure_name) {
        throw new UserInputError(errorTexts.adventureName);
    } else {
        adventure.coordinates_lat = parsedCoordinates.lat;
        adventure.coordinates_lng = parsedCoordinates.lng;
        delete adventure.coordinates;

        return adventure;
    }
};

module.exports = {
    validateCreateAdventure
};