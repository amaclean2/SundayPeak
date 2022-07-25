import { getAdventures, addAdventure, getAdventure } from '../../DB';
import { catchBlock, returnError } from '../../ErrorHandling';
import { getMapboxAccessToken } from '../../Config/connections.js';
import { validateCreateAdventure } from '../../Validators/AdventureValidators.js';

export const adventureResolvers = {
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

            return [];
        },

        deleteAdventure: (parent, args) => {

            return {};
        }
    }
};