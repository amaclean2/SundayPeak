import React, { useEffect } from 'react'
import { useUserStateContext } from '../Providers/UserStateProvider'

export const Consumer = (): JSX.Element | null => {
	const { loginError, userDispatch } = useUserStateContext()

	useEffect(() => {
		userDispatch({ type: 'setLoginError', payload: 'New Error ' })
	}, [userDispatch])

	if (loginError === null) return null

	return <div data-testid={'user-consumer'}>{`My error is: ${loginError}`}</div>
}
