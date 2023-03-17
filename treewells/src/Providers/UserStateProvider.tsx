import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'
import { UserContext } from '../Types/User'
import { fetcher } from '../utils'
import { initialUserState, userReducer } from './Reducers/UserReducer'

const UserStateContext = createContext<UserContext>({} as UserContext)

export const useUserStateContext = () => {
	const context = useContext(UserStateContext)

	if (context === undefined) {
		throw new Error('useUserStateContext must be used within a UserStateProvider')
	}

	return context
}

export const UserStateProvider = ({ children }: { children: ReactNode }) => {
	const [userState, userDispatch] = useReducer(userReducer, initialUserState)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			fetcher('users/loggedIn')
				.then(({ data }) => {
					if (data.user) {
						userDispatch({ type: 'setLoggedInUser', payload: data.user })
					} else {
						delete localStorage.token
					}
				})
				.catch(() => {
					delete localStorage.token
				})
		}
	}, [])

	return (
		<UserStateContext.Provider
			value={{
				...userState,
				userDispatch
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
}
