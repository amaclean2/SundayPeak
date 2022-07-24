import cx from 'classnames';
import { useUserStateContext } from '../../Providers';
import { Field, FieldHeader } from '../Reusable';
import StatTemplate from './StatTemplate';

const Location = ({ value = '' }) => (
    <Field className="location-field stat-template">
        <FieldHeader text={"Location"} />
        {value}
    </Field>
);

const Stats = ({ className }) => {
    const { workingUser } = useUserStateContext();

    return (
        <div className={cx('stats-container', 'stats', 'flex-box', className)} >
            <StatTemplate
                statLabel={"Activities"}
                statValue={workingUser?.activityCount?.count}
            />
            <StatTemplate
                statLabel={"Followers"}
                statValue={workingUser?.followerCount?.count}
            />
            <StatTemplate
                statLabel={"Following"}
                statValue={workingUser?.followingCount?.count}
            />
            <div className="flex-spacer" />
            <Location value={workingUser.city} />
        </div>
    );
};

export default Stats;