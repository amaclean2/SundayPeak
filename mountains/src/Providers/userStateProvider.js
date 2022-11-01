import React, { createContext, useContext, useState } from 'react'

const UserStateContext = createContext()

export const useUserStateContext = () => {
	const context = useContext(UserStateContext)

	if (context === undefined) {
		throw new Error('userUserStateContext must be used within a UserStateProvider')
	}

	return context
}

export const UserStateProvider = ({ children }) => {
	const [workingUser, setWorkingUser] = useState(null)
	const [loggedInUser, loginUser] = useState({})
	const [isLoggedIn, setIsLoggedIn] = useState(undefined)
	const [formFields, setFormFields] = useState({})
	const [isLandingPage, setIsLandingPage] = useState(true)
	const [loginError, setLoginError] = useState('')
	const [imageList, setImageList] = useState([])
	const [isEditable, setIsEditable] = useState(false)
	const [friends, setFriends] = useState(null)
	const [listState, setListState] = useState('')

	const clickOffLanding = () => {
		setIsLandingPage(false)
	}

	const setLoggedInUser = (user) => {
		loginUser(user)
		setWorkingUser(user)
	}

	const handleLogout = async () => {
		setLoggedInUser({})
		setIsLoggedIn(false)
		setWorkingUser(null)
		localStorage.clear()
		return 'SUCCESSFULLY_LOGGED_OUT'
	}

	const editUser = (e) => {
		console.log(e.target.name, e.target.value)
		setWorkingUser({
			...workingUser,
			[e.target.name]: e.target.value
		})
		setFormFields({
			...formFields,
			[e.target.name]: e.target.value
		})
	}

	return (
		<UserStateContext.Provider
			value={{
				isLoggedIn,
				formFields,
				workingUser,
				isLandingPage,
				loginError,
				loggedInUser,
				imageList,
				isEditable,
				friends,
				listState,
				setLoginError,
				setFormFields,
				handleLogout,
				clickOffLanding,
				editUser,
				setWorkingUser,
				setIsLoggedIn,
				setIsLandingPage,
				setLoggedInUser,
				setImageList,
				setIsEditable,
				setFriends,
				setListState
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
}
