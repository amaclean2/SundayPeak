import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useAdventureEditContext } from "../../adventureEditProvider";
import { CREATE_TICK, GET_TICKS_BY_ADVENTURE } from "../TypeDefs";

export const useSaveTick = () => {
    const [
        start,
        { data }
    ] = useMutation(CREATE_TICK);

    const saveTick = ({ adventureId }) => start({ variables: { adventureId, public: false }});

    return {
        saveTick,
        data
    };
};

export const useGetAdventureTicks = () => {
    const { setCurrentAdventure } = useAdventureEditContext();
    const [start, { data }] = useLazyQuery(GET_TICKS_BY_ADVENTURE);

    const getAdventureTicks = ({ adventureId }) => start({ variables: { adventureId }});

    useEffect(() => {
        if (data?.getAllTicksByAdventure) {
            setCurrentAdventure((currAdv) => ({
                ...currAdv,
                ticks: data.getAllTicksByAdventure
            }));
        }
    }, [data]);

    return {
        getAdventureTicks,
        data
    };
};