import Profile from '../Images/Profile';
import Skier from '../Images/Skier';
import LineEditor from '../LineEditor';
import { useCardStateContext } from '../Providers/cardStateProvider';
import UserProfile from '../UserProfile';

import './styles.css';

const ButtonBarButton = ({ children, action, classes = '' }) => {
	return (
		<button className={`button-bar-button ${classes}`} onClick={(e) => action(e)}>
			{children}
		</button>
	);
};

const UserProfileButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			action={() => openCard('profile')}>
			<Profile />
		</ButtonBarButton>
	);
};

const ActivitiesButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			action={() => openCard('lines')}>
			<Skier />
		</ButtonBarButton>
	);
};

const ButtonBar = () => {
	const { notFullyOpen, displayCardBoolState, workingCard } = useCardStateContext();

	return (
		<>
			{notFullyOpen && (
				<div className="button-bar flex-box">
					<UserProfileButton />
					<ActivitiesButton />
				</div>
			)}
			{displayCardBoolState && workingCard === 'profile' && <UserProfile />}
			{displayCardBoolState && workingCard === 'lines' && <LineEditor />}
		</>
	);
};

export default ButtonBar;