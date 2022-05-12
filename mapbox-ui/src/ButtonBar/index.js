import Profile from '../Images/Profile';
import { useCardStateContext } from '../Providers/cardStateProvider';
import UserProfile from '../UserProfile';

import './styles.css';

const ButtonBarButton = ({ text, action, classes = '' }) => {
	return (
		<button className={`button-bar-button ${classes}`} onClick={(e) => action(e)}><Profile /></button>
	);
};

const UserProfileButton = () => {
	const { openCard, displayCardBoolState } = useCardStateContext();

	return (
		<>
			<ButtonBarButton
				text={Profile}
				action={openCard} />

		</>
	);
};

const ButtonBar = () => {
	const { notFullyOpen, displayCardBoolState } = useCardStateContext();

	return (
		<>
			{notFullyOpen && (
				<div className="button-bar">
					<UserProfileButton />
				</div>
			)}
			{displayCardBoolState && <UserProfile />}
		</>
	);
};

export default ButtonBar;