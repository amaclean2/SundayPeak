import React from 'react';

import { Skier, Profile } from '../../Images';
import AdventureEditor from '../AdventureEditor';
import UserProfile from '../UserProfile';
import { LoginFlow, SignupFlow } from '../SignupFlow';
import { CARD_STATES, useCardStateContext, useUserStateContext } from '../../Providers';

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
			action={() => openCard(CARD_STATES.login)}>
			Log In
		</ButtonBarButton>
	);
};

const SignUpButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			className="signup-button"
			action={() => openCard(CARD_STATES.signup)}>
			Create an Account
		</ButtonBarButton>
	);
};

const UserProfileButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			action={() => openCard(CARD_STATES.profile)}>
			<Profile />
		</ButtonBarButton>
	);
};

const ActivitiesButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<ButtonBarButton
			action={() => openCard(CARD_STATES.adventures)}>
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
			{displayCardBoolState && workingCard === CARD_STATES.profile && <UserProfile />}
			{displayCardBoolState && workingCard === CARD_STATES.adventures && <AdventureEditor />}
			{displayCardBoolState && workingCard === CARD_STATES.signup && <SignupFlow />}
			{displayCardBoolState && workingCard === CARD_STATES.login && <LoginFlow />}
		</>
	);
};

export default ButtonBar;