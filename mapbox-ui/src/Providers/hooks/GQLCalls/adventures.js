import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useAdventureEditContext } from '../../adventureEditProvider';
import { useCardStateContext } from '../../cardStateProvider';
import { CREATE_ADVENTURE, GET_ADVENTURE, GET_ALL_ADVENTURES } from '../../typeDefs';
import { validateAdventure } from '../../utils';

export const useGetAdventure = () => {
    // handle fetching an adventure
    const [ getAdventure, { data, error, loading }] = useLazyQuery(GET_ADVENTURE);
    const { setCurrentAdventure } = useAdventureEditContext();

    const start = (id) => getAdventure({ variables: { id }});

    useEffect(() => {
        if (data) {
            setCurrentAdventure(data.getAdventureDetails);
        }
    }, [data]);

    return {
        start,
        data,
        error, 
        loading
    };
};

export const useGetAdventures = () => {
    const defaultStartPosition = { lat: 39.347, lng: -120.194, zoom: 10 };
    const { setAllAdventures } = useAdventureEditContext();

    const [start, {
		loading,
		error,
		data,
	}] = useLazyQuery(GET_ALL_ADVENTURES, {
		variables: {
			coordinates: JSON.stringify(defaultStartPosition),
			type: 'line',
			zoom: 10
		}
	});

    const queryAdventures = () => {
        return start({
            coordinates: JSON.stringify(defaultStartPosition),
            type: 'line',
            zoom: 10
        });
    };

    useEffect(() => {
        if (data) {
            setAllAdventures(data.getAllAdventures);
        }
    }, [data]);

    return {
        data,
        error,
        loading,
        defaultStartPosition,
        queryAdventures
    }
};

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

    /**
     * @desc sends the gql request once the user validates the details
     */
    const saveNewAdventure = async () => {
        try {
			console.log("CREATING_ADVENTURE...", currentAdventure);

			createAdventure({ variables: { input: currentAdventure }})
            .then(() => closeCard());
		} catch (error) {
            setAdventureError(error.toString().replace('Error: ', ''));
		}
    };

    /**
     * @desc validates the adventure details before sending the gql request
     */
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