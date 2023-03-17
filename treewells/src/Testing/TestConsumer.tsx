import React, { useEffect } from 'react'
import { useUserStateContext } from '../Providers/UserStateProvider'

export const Consumer = () => {
	const { loginError, userDispatch } = useUserStateContext()

	useEffect(() => {
		if (!userDispatch) return

		userDispatch({ type: 'setLoginError', payload: 'New Error ' })
	}, [userDispatch])

	if (!loginError) return null

	return <div data-testid={'user-consumer'}>{`My error is: ${loginError}`}</div>
}
