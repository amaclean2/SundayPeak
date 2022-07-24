const { UserInputError, ApolloError } = require('apollo-server-express');
const { getAdventures, addAdventure, getAdventure } = require('../../DB');
const { catchBlock, returnError } = require('../../ErrorHandling');
const { getMapboxAccessToken } = require('../../Config/connections');
const Lines = require('../../SampleData/LineData.json');
const { validateCreateAdventure } = require('../../Validators/AdventureValidators');

const adventureResolvers = {
    Query: {
        getAllAdventures: async (parent, args) => {
            try {
                const { coordinates, type, zoom } = args;
                const parsedCoordinates = JSON.parse(coordinates);
                const adventures = await getAdventures(parsedCoordinates, 'line', 10);
                const mapboxToken = getMapboxAccessToken();

                return {
                    adventures,
                    mapboxToken
                };
            } catch (error) {
                throw catchBlock({ error, message: 'serverGetAdventures' });
            }
        },
        getAdventureDetails: async (parent, args) => {
            try {
                const { id } = args;
                
                if (id) {
                    return await getAdventure(id);
                }

                return returnError({ message: 'adventureIdFieldRequired' });

            } catch (error) {
                throw catchBlock({ message: 'serverGetAdventureDetails', error });
            }
        }
    },

    Mutation: {
        createAdventure: async (parent, args, context) => {
            try {
                args.creator_id = context.user_id;
                
                const validationResponse = await validateCreateAdventure(args);
                const resultId = await addAdventure(validationResponse);

                console.log("ADVENTURE_CREATED", resultId, validationResponse);

                validationResponse.id = resultId;
                return validationResponse;

            } catch (error) {
                throw catchBlock({ message: 'serverCreateAdventure', error });
            }
        },

        editAdventure: (parent, args) => {
            const { id, name, approach, season, avg_angle, max_angle, elevation, dificulty, gain, bio, city, last_editor_id } = args;
            const editableLineIdx = Lines.findIndex((line) => line.id === id);

            const newLineData = {
                ...Lines[editableLineIdx],
                name,
                approach,
                season,
                avg_angle,
                max_angle,
                elevation,
                dificulty,
                gain,
                bio,
                city,
                editor_ids: [...Lines[editableLineIdx].editor_ids, last_editor_id]
            };

            Lines = [...Lines.slice(0, editableLineIdx), newLineData, ...Lines.slice(editableLineIdx + 1)];

            return newLineData;
        },

        deleteAdventure: (parent, args) => {
            const { id } = args;
            const lineIdx = Lines.findIndex((line) => line.id === id);

            const seelctedLine = Lines[lineIdx];

            Lines = [...Lines.slice(0, lineIdx), ...Lines.slice(lineIdx + 1)];

            return seelctedLine;
        }
    }
};

module.exports = {
    adventureResolvers
};