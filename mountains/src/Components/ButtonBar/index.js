import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import { Skier, Profile } from '../../Images';
import AdventureEditor from '../AdventureEditor';
import UserProfile from '../UserProfile';
import { LoginFlow, SignupFlow } from '../SignupFlow';
import { CARD_STATES, useCardStateContext, useUserStateContext } from '../../Providers';
import { Button } from '../Reusable';

import './styles.css';

const LoginButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<Button
			className={cx('button-bar-button', 'login-button')}
			onClick={() => openCard(CARD_STATES.login)}>
			Log In
		</Button>
	);
};

const SignUpButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<Button
			className={cx('button-bar-button', 'signup-button')}
			onClick={() => openCard(CARD_STATES.signup)}>
			Create an Account
		</Button>
	);
};

const UserProfileButton = () => {
	const { openCard } = useCardStateContext();
	const { setWorkingUser, loggedInUser, workingUser } = useUserStateContext();
	const [buttonClicked, setButtonClicked] = useState(false);

	const handleProfileButton = () => {
		setButtonClicked(true);
		setWorkingUser(loggedInUser);
	};

	useEffect(() => {
		if (workingUser?.id === loggedInUser?.id && buttonClicked) {
			openCard(CARD_STATES.profile);
			setButtonClicked(false);
		}
	}, [workingUser, buttonClicked]);

	return (
		<Button
			className="button-bar-button"
			onClick={() => handleProfileButton()}
		>
			<Profile />
		</Button>
	);
};

const ActivitiesButton = () => {
	const { openCard } = useCardStateContext();

	return (
		<Button
			className="button-bar-button"
			onClick={() => openCard(CARD_STATES.adventures)}>
			<Skier />
		</Button>
	);
};

const ButtonBar = () => {
	const { notFullyOpen, displayCardBoolState, workingCard } = useCardStateContext();
	const { isLoggedIn } = useUserStateContext();

	if (isLoggedIn === undefined) {
		return null;
	}

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