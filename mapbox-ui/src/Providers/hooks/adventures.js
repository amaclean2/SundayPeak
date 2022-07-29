import { debounce } from 'throttle-debounce';

import { useAdventureEditContext } from "../adventureEditProvider";
import { useCardStateContext } from "../cardStateProvider";
import { fetcher, validateAdventure } from "../utils";

export const useGetAdventure = () => {
    const { setCurrentAdventure } = useAdventureEditContext();

    const getAdventure = async ({ id }) => {
        return fetcher(`/adventures/details?id=${id}`)
            .then(({ data }) => {
                setCurrentAdventure(data.adventure);

                return data;
            }).catch(console.error);
    };

    return { getAdventure };
};

export const useGetAdventures = () => {
    const { setAllAdventures, setMapboxToken, startPosition, setStartPosition } = useAdventureEditContext();

    const getAllAdventures = async () => {
        const queryUrl = `/adventures/all?lat=${startPosition.lat}&lng=${startPosition.lng}&type=line&zoom=${startPosition.zoom}`;
        return fetcher(queryUrl)
            .then(({ data: { adventures, mapboxToken } }) => {
                setMapboxToken(mapboxToken);
                setAllAdventures((currAdventures) => ([
                    ...currAdventures,
                    ...adventures
                ]));

                return adventures;
            }).catch(console.error);
    };

    const refetchAdventures = debounce(1000, (newStartPosition) => {
        const queryUrl = (newStartPosition)
            ? `/adventures/all?lat=${newStartPosition.lat}&lng=${newStartPosition.lng}&type=line&zoom=${newStartPosition.zoom}`
            : `/adventures/all?lat=${startPosition.lat}&lng=${startPosition.lng}&type=line&zoom=${startPosition.zoom}`;
        return fetcher(queryUrl)
            .then(({ data: { adventures } }) => {
                setAllAdventures((currAdventures) => ([
                    ...currAdventures,
                    ...adventures
                ]));
                setStartPosition(newStartPosition);

                return adventures;
            }).catch(console.error);
    });

    return { getAllAdventures, refetchAdventures };
};

export const useSaveAdventure = () => {
    const {
        currentAdventure,
        setAdventureError,
        setIsEditable,
        setCurrentAdventure
    } = useAdventureEditContext();

    const { closeCard } = useCardStateContext();

    const saveNewAdventure = () => {
        return fetcher(`/adventures/create`, {
            method: 'POST',
            body: currentAdventure
        }).then(() => closeCard())
            .catch((error) => {
                console.error(error);
                setAdventureError(error.toString().replace('Error: ', ''));

                return error;
            });
    };

    const startAdventureSaveProcess = () => {
        try {
            const validatedAdventure = validateAdventure(currentAdventure, setAdventureError);
            setCurrentAdventure(validatedAdventure);
            setIsEditable(false);

            return validatedAdventure;
        } catch (error) {
            console.error(error);
            setAdventureError(error.toString().replace('Error: ', ''));
        }
    };

    return {
        saveNewAdventure,
        startAdventureSaveProcess
    };
};