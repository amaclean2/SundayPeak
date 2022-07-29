import { useEffect, useState } from 'react';
import {
    CARD_STATES,
    useAdventureEditContext,
    useCardStateContext,
    useGetOtherUser,
    useUserStateContext
} from '../../Providers';
import { Field, FieldHeader, FieldRow } from '../Reusable';

const UserImage = () => (
    <div className="user-image" />
);

const MailIcon = () => (
    <div className="mail-icon" />
);

const AdventureTickPanel = () => {
    const { currentAdventure } = useAdventureEditContext();
    const { switchCard } = useCardStateContext();
    const { getOtherUser } = useGetOtherUser();
    const { workingUser } = useUserStateContext();

    const [ticks, setTicks] = useState(null);
    const [userOnLoad, setUserOnLoad] = useState();

    useEffect(() => {
        workingUser?.id && setUserOnLoad(workingUser.id);
    }, []);

    useEffect(() => {
        if (currentAdventure?.ticks) {
            setTicks(currentAdventure.ticks);
        }
    }, [currentAdventure]);

    const transitionToUsers = (user_id) => {
        getOtherUser({ user_id });
    };

    useEffect(() => {
        if (userOnLoad && workingUser?.id && userOnLoad !== workingUser?.id) {
            switchCard(CARD_STATES.profile);
        }
    }, [workingUser]);

    if (!ticks) {
        return null;
    }

    return (
        <FieldRow>
            <Field>
                <FieldHeader text="BYF" />
                <table className="tick-list">
                    <tbody>
                        {ticks.map((tick, key) => (
                            <tr key={`user_${key}`} onClick={() => transitionToUsers(tick.user_id)}>
                                <td><UserImage /></td>
                                <td>{tick.first_name} {tick.last_name}</td>
                                <td></td>
                                <td><MailIcon /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Field>
        </FieldRow>
    );
};

export default AdventureTickPanel;