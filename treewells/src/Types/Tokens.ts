import type { Dispatch } from 'react'

type SetTokenState = {
	type: 'setTokens'
	payload: {
		mapboxToken: string
		mapboxStyleKey: string
	}
}

export type TokenAction = SetTokenState

export type TokenState = {
	mapboxToken: string | null
	mapboxStyleKey: string | null
	mapStyle: string | null
}

export type TokenContext = TokenState & { tokenDispatch: Dispatch<TokenAction> }
