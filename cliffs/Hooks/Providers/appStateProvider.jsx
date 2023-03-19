import { createContext, useContext, useReducer } from 'react'

const initiateAppState = {
	mapboxToken: '',
	mapboxStyle: ''
}

const AppStateContext = createContext({})

export const useAppStateContext = () => {
	const context = useContext(AppStateContext)

	if (context === undefined) {
		throw new Error('useAppStateContext must be used within a AppStateProvider')
	}

	return context
}

export const AppStateProvider = ({ children }) => {
	const appReducer = (state, action) => {
		switch (action.type) {
			case 'setMapboxData':
				return {
					...state,
					mapboxToken: action.payload.mapboxToken,
					mapboxStyle: action.payload.mapboxStyle
				}
			default:
				return state
		}
	}

	const [appState, appDispatch] = useReducer(appReducer, initiateAppState)

	return (
		<AppStateContext.Provider
			value={{
				...appState,
				appDispatch
			}}
		>
			{children}
		</AppStateContext.Provider>
	)
}
