import React from 'react';

import Profile from '../Images/Profile';
import Skier from '../Images/Skier';
import AdventureEditor from '../AdventureEditor';
import UserProfile from '../UserProfile';
import { useCardStateContext } from '../Providers/cardStateProvider';
import { useUserStateContext } from '../Providers/userStateProvider';
import LoginFlow from '../SignupFlow/login';
import SignupFlow from '../SignupFlow/signup';

import './styles.css';

const ButtonBarButton = ({ children, action, className = '' }) => {
	return (
		<button className={`button-bar-button ${className}`} onClick={(e) => action(e)}>
			{children}
		</button>
	);
};

const LoginButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			className="login-button"
			action={() => openCard('login')}>
			Login
		</ButtonBarButton>
	);
};

const SignUpButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			className="signup-button"
			action={() => openCard('signup')}>
			Create an Account
		</ButtonBarButton>
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
			action={() => openCard('adventures')}>
			<Skier />
		</ButtonBarButton>
	);
};

const ButtonBar = () => {
	const { notFullyOpen, displayCardBoolState, workingCard } = useCardStateContext();
	const { isLoggedIn } = useUserStateContext();

	return (
		<>
			{notFullyOpen && (
				<div className="button-bar flex-box">
					{!isLoggedIn && <SignUpButton />}
					{!isLoggedIn && <LoginButton />}
					{isLoggedIn && <UserProfileButton />}
					<ActivitiesButton />
				</div>
			)}
			{displayCardBoolState && workingCard === 'profile' && <UserProfile />}
			{displayCardBoolState && workingCard === 'adventures' && <AdventureEditor />}
			{displayCardBoolState && workingCard === 'signup' && <SignupFlow />}
			{displayCardBoolState && workingCard === 'login' && <LoginFlow />}
		</>
	);
};

export default ButtonBar;