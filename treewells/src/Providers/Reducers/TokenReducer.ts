import type { TokenAction, TokenState } from '../../Types/Tokens'

export const initialTokenState: TokenState = {
	mapboxToken: null,
	mapboxStyleKey: null
}

export const tokenReducer = (state: TokenState, action: TokenAction): TokenState => {
	switch (action.type) {
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
