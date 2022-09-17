import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useUserStateContext } from '../../Providers';

const Tick = ({ tickName }) => (
	<span className="tick">{tickName}</span>
);

const UserTickPanel = ({ className }) => {
    const { workingUser } = useUserStateContext();
    const [ticks, setTicks] = useState(null);

    useEffect(() => {
        if (workingUser?.ticks) {
            setTicks(workingUser.ticks);
        }
    }, [workingUser]);

    return (
        <div className={cx(className, 'tick-list flex-box')}>
            <h3 className="label-field">Tick List</h3>
            <div className="tick-list flex-box">
                {ticks?.map((tick, key) => (
                    <Tick tickName={tick.adventure_name} key={`user_tick_${key}`} />
                ))}
            </div>
        </div>
    )
};

export default UserTickPanel;