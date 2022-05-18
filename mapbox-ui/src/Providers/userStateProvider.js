import { createContext, useContext, useEffect, useState } from 'react';

import { User } from '../SampleData/Users';

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
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userFields, setUserFields] = useState({});
	const [loginFields, setLoginFields] = useState({});

	useEffect(() => {
		const loggedUser = localStorage.getItem('user');
		if (loggedUser) {
			const parsedUser = JSON.parse(loggedUser);
			setWorkingUser(parsedUser);
			setIsLoggedIn(true);
		}
	}, []);

	const attemptLogin = async () => {
		const email = loginFields.email;

		if (email) {
			setWorkingUser(User);
			setIsLoggedIn(true);
			setLoginFields({});
			localStorage.setItem('user', JSON.stringify(workingUser));
			return 'USER_LOGGED_IN';
		} else {
			throw new Error('EMAIL_FIELD_REQUIRED');
		}
	};

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
				setUserFields,
				setLoginFields,
				attemptLogin,
				handleLogout
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
};