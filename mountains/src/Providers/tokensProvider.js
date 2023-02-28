import { createContext, useContext, useReducer } from 'react'

const TokenStateContext = createContext()

export const useTokenStateContext = () => {
	const context = useContext(TokenStateContext)

	if (context === undefined) {
		throw new Error('useTokenStateContext must be used within a TokenStateProvider')
	}
	return context
}

export const TokenStateProvider = ({ children }) => {
	const initialTokenState = {
		mapboxToken: null,
		mapboxStyleKey: null,
		firebaseApiKey: ''
	}

	const tokenReducer = (state, action) => {
		switch (action.type) {
			case 'setFirebaseKey':
				return { ...state, firebaseApiKey: action.payload }
			case 'setMapboxToken':
				return { ...state, mapboxToken: action.payload }
			case 'setTokens':
				return {
					...state,
					mapboxToken: action.payload.mapboxToken,
					mapboxStyleKey: action.payload.mapboxStyleKey,
					firebaseApiKey: action.payload.firebaseApiKey,
					mapboxStyles: action.payload.mapboxStyles
				}
			default:
				return state
		}
	}

	const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

	return (
		<TokenStateContext.Provider
			value={{
				...tokenState,
				tokenDispatch
			}}
		>
			{children}
		</TokenStateContext.Provider>
	)
}
