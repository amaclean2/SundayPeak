import { useMutation } from '@apollo/client';

import { CREATE_ADVENTURE } from '../../Providers/typeDefs';
import { useAdventureEditContext, useCardStateContext } from '../../Providers';
import { validateAdventure } from '../../Providers/utils';

export const useSaveAdventure = () => {
    const {
        currentAdventure,
        setAdventureError,
        setIsEditable,
        setCurrentAdventure
    } = useAdventureEditContext();

    const { closeCard } = useCardStateContext();

    const [
		createAdventure,
		{ data: adventureMutationData }
	] = useMutation(CREATE_ADVENTURE);

    const saveNewAdventure = async () => {
        try {
			console.log("CREATING_ADVENTURE...", currentAdventure);

			createAdventure({ variables: { input: currentAdventure }})
            .then(() => closeCard());
		} catch (error) {
            setAdventureError(error.toString().replace('Error: ', ''));
		}
    };

    const startAdventureSaveProcess = async () => {
        try {
            const validatedAdventure = validateAdventure(currentAdventure, setAdventureError);
            setCurrentAdventure(validatedAdventure);
            setIsEditable(false);

            return validatedAdventure;
        } catch (error) {
            console.log("ADVENTURE_SAVE_ERROR", error);
            setAdventureError(error.toString().replace('Error: ', ''));
            return { error };
        }

    };

    return {
        newAdventureData: adventureMutationData,
        saveNewAdventure,
        startAdventureSaveProcess
    };
};