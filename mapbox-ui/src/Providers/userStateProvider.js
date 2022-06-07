import React, { createContext, useContext, useEffect, useState } from 'react';

import { useLogin } from './apiCalls';
import { useCardStateContext } from './cardStateProvider';

const UserStateContext = createContext();

export const useUserStateContext = () => {
	const context = useContext(UserStateContext);

	if (context === undefined) {
		throw new Error('userUserStateContext must be used within a UserStateProvider');
	}

	return context;
};

export const UserStateProvider = ({ children }) => {
	const { loginUser } = useLogin();
	const { closeCard } = useCardStateContext();

	const [workingUser, setWorkingUser] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userFields, setUserFields] = useState({});
	const [loginFields, setLoginFields] = useState({});
	const [isLandingPage, setIsLandingPage] = useState(true);
	const [loginError, setLoginError] = useState(null);

	useEffect(() => {
		const loggedUser = localStorage.getItem('token');
		if (loggedUser) {
			const parsedUser = JSON.parse(loggedUser);
			setWorkingUser(parsedUser);
			setIsLoggedIn(true);
			setIsLandingPage(false);
		}
	}, []);

	const attemptLogin = async () => {
		const {email, password} = loginFields;

		if (email && password) {

			try {
				const loggedInUser = await loginUser({ email, password });

				if (loggedInUser) {
					setWorkingUser(loggedInUser);
					setIsLoggedIn(true);
					setIsLandingPage(false);
					setLoginFields({});
					closeCard();
					return 'USER_LOGGED_IN';
				}

			} catch (error) {
				console.log('User login failed', error);
				setLoginError(error.message);
			}

		} else {
			setLoginError('Email field required');
		}
	};

	const clickLogin = () => {
		setIsLandingPage(false);
	}

	const handleLogout = async () => {
		setWorkingUser({});
		setIsLoggedIn(false);
		localStorage.clear();
		return 'SUCCESSFULLY_LOGGED_OUT';
	};

	return (
		<UserStateContext.Provider
			value={{
				isLoggedIn,
				userFields,
				loginFields,
				workingUser,
				isLandingPage,
				loginError,
				setLoginError,
				setUserFields,
				setLoginFields,
				attemptLogin,
				handleLogout,
				clickLogin
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
};