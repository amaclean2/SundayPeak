import React, { createContext, type ReactNode, useContext, useEffect, useReducer } from 'react'
import { Storage } from '../config'
import { users } from '../Hooks/Apis'
import { type UserContext } from '../Types/User'
import { fetcher } from '../utils'
import { initialUserState, userReducer } from './Reducers/UserReducer'

const UserStateContext = createContext({} as UserContext)

export const useUserStateContext = (): UserContext => {
	const context = useContext(UserStateContext)

	if (context === undefined) {
		throw new Error('useUserStateContext must be used within a UserStateProvider')
	}

	return context
}

export const UserStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [userState, userDispatch] = useReducer(userReducer, initialUserState)

	useEffect(() => {
		Storage.getItem('token')
			.then((token) => {
				if (token !== null) {
					fetcher(users.getLoggedIn.url, { method: users.getLoggedIn.method })
						.then(({ data }) => {
							if (data.user !== undefined) {
								userDispatch({ type: 'setLoggedInUser', payload: data.user })
							} else {
								void Storage.removeItem('token')
							}
						})
						.catch(() => {
							void Storage.removeItem('token')
						})
				}
			})
			.catch(console.error)
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
