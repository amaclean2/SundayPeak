import React, { createContext, useContext, useEffect, useState } from 'react';

import { useLogin } from './hooks/externalCalls';
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
	const { loginUser, createUser } = useLogin();
	const { closeCard } = useCardStateContext();

	const [workingUser, setWorkingUser] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [formFields, setFormFields] = useState({});
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
		const {email, password} = formFields;

		if (email && password) {

			try {
				const loggedInUser = await loginUser({ email, password });

				if (loggedInUser) {
					setWorkingUser(loggedInUser);
					setIsLoggedIn(true);
					setIsLandingPage(false);
					setFormFields({});
					closeCard();
					return 'USER_LOGGED_IN';
				}

			} catch (error) {
				console.log('User login failed', error);
				setLoginError(error.message);
			}
		} else {
			setLoginError('Email and Password fields are required. Please try again.');
		}
	};

	const attemptSignup = async () => {
		const { email, password, firstName, lastName, password2 } = formFields;

		if (email && password && password2 && firstName && lastName) {
			try {
				const createdUser = await createUser({ email, password, first_name: firstName, last_name: lastName, password2});

				if (createdUser) {
					setWorkingUser(createdUser);
					setIsLoggedIn(true);
					setIsLandingPage(false);
					setFormFields({});
					closeCard();
					return 'USER_CREATED';
				}
			} catch (error) {
				console.log('User creation failed', error);
				setLoginError(error.message);
			}
		} else {
			console.log({email, password, firstName, lastName, password2});
			setLoginError('Email, Password, Confirm Password, First Name, and Last Name fields are required. Please try again.');
		}
	}

	const clickOffLanding = () => {
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
				formFields,
				workingUser,
				isLandingPage,
				loginError,
				setLoginError,
				setFormFields,
				attemptLogin,
				attemptSignup,
				handleLogout,
				clickOffLanding
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
};