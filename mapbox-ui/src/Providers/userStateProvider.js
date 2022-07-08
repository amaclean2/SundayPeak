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

	const [workingUser, setWorkingUser] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState(undefined);
	const [formFields, setFormFields] = useState({});
	const [isLandingPage, setIsLandingPage] = useState(true);
	const [loginError, setLoginError] = useState(null);

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
				handleLogout,
				clickOffLanding,
				setWorkingUser,
				setIsLoggedIn,
				setIsLandingPage,
				setFormFields
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
};