import React, { useEffect, useRef } from 'react'

import { useGetUser } from './Providers'

import './App.css'
import './variables.css'
import AppRouter from './Router'

export const title = 'Sunday Peak'

const App = () => {
	const { getInitialCall } = useGetUser()
	const loadingRef = useRef(false)

	useEffect(() => {
		if (!loadingRef.current) {
			loadingRef.current = true
			getInitialCall()
		}
	}, [])

	return <AppRouter />
}

export default App
