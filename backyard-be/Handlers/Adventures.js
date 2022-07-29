import { getAdventure, getTicksByAdventure } from "../DB";

export const buildAdventureObject = async ({ id }) => {
    const adventure = await getAdventure(id);
    const ticks = await getTicksByAdventure({ adventure_id: id });

    return {
        ...adventure,
        ticks
    };
};