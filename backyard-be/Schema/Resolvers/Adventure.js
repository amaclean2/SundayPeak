const { UserInputError, ApolloError } = require('apollo-server-express');
const { getAdventures, addAdventure } = require('../../DB');
const Lines = require('../../SampleData/LineData.json');
const statuses = require('../../statuses');
const { validateCreateAdventure } = require('../../Validators/AdventureValidators');

const adventureResolvers = {
    Query: {
        getAllAdventures: async (parent, args) => {
            try {
                const { coordinates, type, zoom } = args;
                const parsedCoordinates = JSON.parse(coordinates);
                return await getAdventures(parsedCoordinates, 'line', 10);
            } catch (error) {
                console.log("SERVER_ERROR", error);
                throw new ApolloError('SERVER_ERROR', statuses.SERVER_ERROR, error);
            }
        },
        getAdventureDetails: (parent, args) => {
            const { id } = args;
            console.log("ID", id);
            return Lines.find((line) => line.id === id);
        }
    },

    Mutation: {
        createAdventure: async (parent, args) => {
            try {
                const validationResponse = await validateCreateAdventure(args);

                const resultId = await addAdventure(validationResponse);

                console.log("ADVENTURE_CREATED", resultId, validationResponse);

                validationResponse.id = resultId;

                return validationResponse;

            } catch (finalErrors) {
                console.log("ADVENTURE_CREATION_ERROR", finalErrors);
                throw new ApolloError('SERVER_ERROR', statuses.SERVER_ERROR, finalErrors);
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