import React, { createContext, useContext, useReducer } from 'react'

const UserStateContext = createContext()

export const useUserStateContext = () => {
	const context = useContext(UserStateContext)

	if (context === undefined) {
		throw new Error('userUserStateContext must be used within a UserStateProvider')
	}

	return context
}

export const UserStateProvider = ({ children }) => {
	const initialUserState = {
		workingUser: null,
		loggedInUser: {},
		isLoggedIn: undefined,
		formFields: {},
		loginError: '',
		isUserEditable: false,
		friends: null,
		listState: '',
		searchList: null
	}

	const userReducer = (state, action) => {
		switch (action.type) {
			case 'workingUser':
				return { ...state, workingUser: action.payload }
			case 'editUser':
				return {
					...state,
					workingUser: {
						...state.workingUser,
						[action.payload.name]: action.payload.value
					},
					formFields: {
						...state.formFields,
						[action.payload.name]: action.payload.value
					}
				}
			case 'loginUser':
				return {
					...state,
					loggedInUser: action.payload,
					workingUser: action.payload,
					isLoggedIn: !!action.payload,
					loginError: '',
					formFields: {}
				}
			case 'logout':
				localStorage.clear()
				return { ...state, loggedInUser: {}, isLoggedIn: false }
			case 'formFields':
				return { ...state, formFields: action.payload, loginError: '' }
			case 'loginError':
				return { ...state, loginError: action.payload }
			case 'clearLoginEerror':
				return { ...state, loginError: '' }
			case 'clearForm':
				return { ...state, loginError: '', formFields: {} }
			case 'toggleIsUserEditable':
				return { ...state, isUserEditable: !state.isUserEditable }
			case 'closeUser':
				return { ...state, isUserEditable: false, listState: false }
			case 'isUserEditable':
				return { ...state, isUserEditable: action.payload }
			case 'clearFriends':
				return { ...state, friends: null }
			case 'friends':
				return { ...state, friends: action.payload }
			case 'selectListState':
				return { ...state, listState: action.payload }
			default:
				return state
		}
	}

	const [userState, userDispatch] = useReducer(userReducer, initialUserState)

	const editUser = (e) => {
		userDispatch({ type: 'editUser', payload: { name: e.target.name, value: e.target.value } })
	}

	return (
		<UserStateContext.Provider
			value={{
				...userState,
				activeWorkingUser: userState.workingUser?.id !== userState.loggedInUser?.id,
				userDispatch,
				editUser
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
}
