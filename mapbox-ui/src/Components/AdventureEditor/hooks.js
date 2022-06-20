import { useMutation } from '@apollo/client';

import { CREATE_ADVENTURE } from '../../Providers/typeDefs';
import { useAdventureEditContext } from '../../Providers';
import { validateAdventure } from '../../Providers/utils';

export const useSaveAdventure = () => {
    const { currentAdventure, setAdventureError } = useAdventureEditContext();

    const [
		createAdventure,
		{ data: adventureMutationData }
	] = useMutation(CREATE_ADVENTURE);

    const saveNewAdventure = () => {
        try {
			console.log("CREATING_ADVENTURE...", currentAdventure);
			
			const formattedAdventure = validateAdventure(currentAdventure, setAdventureError);

			createAdventure({ variables: { input: formattedAdventure }});
		} catch (error) {
			console.log("ADVENTURE_ERROR", error);
		}
    };

    return {
        newAdventureData: adventureMutationData,
        saveNewAdventure
    };
};