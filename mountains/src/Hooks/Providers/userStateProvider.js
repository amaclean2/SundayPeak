import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { fetcher } from './utils'

const UserStateContext = createContext()

export const useUserStateContext = () => {
	const context = useContext(UserStateContext)

	if (context === undefined) {
		throw new Error('useUserStateContext must be used within a UserStateProvider')
	}

	return context
}

export const UserStateProvider = ({ children }) => {
	const initialUserState = {
		workingUser: null,
		loggedInUser: null,
		formFields: {},
		loginError: '',
		isUserEditable: false,
		friends: null,
		listState: 'completed',
		searchList: null,
		images: []
	}

	const userReducer = (state, action) => {
		switch (action.type) {
			case 'images':
				return { ...state, images: action.payload }
			// non-react state
			case 'workingUser':
				return { ...state, workingUser: action.payload, friends: action.payload.friends }
			case 'editUser':
				return {
					...state,
					loggedInUser: {
						...state.loggedInUser,
						[action.payload.name]: action.payload.value
					},
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
					friends: action.payload?.friends || [],
					workingUser: action.payload,
					loginError: '',
					formFields: {}
				}
			case 'updateLoggedInUser':
				return {
					...state,
					loggedInUser: action.payload,
					friends: action.payload.friends
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
			case 'friends':
				return { ...state, friends: action.payload }
			case 'selectListState':
				return { ...state, listState: action.payload }
			default:
				return state
		}
	}

	const [userState, userDispatch] = useReducer(userReducer, initialUserState)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			fetcher('/users/loggedIn')
				.then(({ data }) => {
					if (data.user) userDispatch({ type: 'loginUser', payload: data.user })
					else {
						delete localStorage.token
					}
				})
				.catch((error) => {
					delete localStorage.token
				})
		}
	}, [])

	return (
		<UserStateContext.Provider
			value={{
				...userState,
				activeWorkingUser: userState.workingUser?.id !== userState.loggedInUser?.id,
				userDispatch
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
}
