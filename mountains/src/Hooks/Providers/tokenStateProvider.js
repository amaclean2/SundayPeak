import { createContext, useContext, useEffect, useReducer } from 'react'
import { fetcher } from './utils'

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
		mapboxStyleKey: null
	}

	const tokenReducer = (state, action) => {
		switch (action.type) {
			case 'setMapboxToken':
				return { ...state, mapboxToken: action.payload }
			case 'setTokens':
				return {
					...state,
					mapboxToken: action.payload.mapboxToken,
					mapboxStyleKey: action.payload.mapboxStyleKey
				}
			default:
				return state
		}
	}

	const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

	// get tokens for the app
	useEffect(() => {
		fetcher('/services/initial').then(({ data }) => {
			tokenDispatch({
				type: 'setTokens',
				payload: {
					mapboxToken: data.mapbox_token,
					mapboxStyleKey: data.map_style
				}
			})
		})
	}, [])

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
