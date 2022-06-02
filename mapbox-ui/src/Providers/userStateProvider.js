import { createContext, useContext, useEffect, useState } from 'react';

import { useLogin } from './apiCalls';

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

	const [workingUser, setWorkingUser] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userFields, setUserFields] = useState({});
	const [loginFields, setLoginFields] = useState({});
	const [isLandingPage, setIsLandingPage] = useState(true);

	useEffect(() => {
		const loggedUser = localStorage.getItem('user');
		if (loggedUser) {
			const parsedUser = JSON.parse(loggedUser);
			console.log("PARSED_USER", parsedUser);
			setWorkingUser(parsedUser);
			setIsLoggedIn(true);
			setIsLandingPage(false);
		}
	}, []);

	const attemptLogin = async () => {
		const {email, password} = loginFields;

		if (email) {

			try {
				const loggedInUser = await loginUser({ email, password });

				if (loggedInUser) {
					setWorkingUser(loggedInUser);
					setIsLoggedIn(true);
					setIsLandingPage(false);
					setLoginFields({});
					localStorage.setItem('user', JSON.stringify(loggedInUser));
					return 'USER_LOGGED_IN';
				}

			} catch (error) {
				throw new Error(error);
			}

		} else {
			throw new Error('EMAIL_FIELD_REQUIRED');
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