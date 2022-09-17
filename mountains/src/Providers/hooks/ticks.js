import { useUserStateContext } from "../userStateProvider";
import { fetcher } from "../utils";

export const useSaveTick = () => {
    const { setLoggedInUser, setWorkingUser } = useUserStateContext();

    const saveTick = ({ adventureId }) => {
        fetcher(`/ticks/create`, {
            method: 'POST',
            body: {
                adventure_id: adventureId,
                public: false
            }
        }).then(({ data: { user } }) => {
            setLoggedInUser(user);
            setWorkingUser(user)
        }).catch(console.error);
    };

    return {
        saveTick
    };
};