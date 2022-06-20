const { UserInputError } = require("apollo-server-express");
const errorTexts = require("../ResponseText/errors");

const validateCreateAdventure = async (adventure) => {

    if (adventure.input) {
        adventure = {
            ...adventure,
            ...adventure.input
        };

        delete adventure.input;
    }

    // escaping single quotes
    for (key in adventure) {
        if (typeof adventure[key] === 'string' && adventure[key].includes('\'')) {
            adventure[key] = adventure[key].replace(/'/g, "\\'");
        }
    }

    console.log("ADVENTURE_VALIDATOR", adventure);

    const {
        adventure_type,
        adventure_name,
        creator_id,
        coordinates,
    } = adventure;

    console.log("COORDINATES", coordinates);
    const parsedCoordinates = JSON.parse(coordinates);

    console.log("PARSED_COORDINATES", parsedCoordinates);

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