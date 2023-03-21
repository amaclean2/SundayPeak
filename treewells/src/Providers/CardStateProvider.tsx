import React, { createContext, type ReactNode, useContext, useReducer } from 'react'
import type { CardContext } from '../Types/Cards'
import { cardReducer, initialCardState } from './Reducers/CardReducer'

const CardStateContext = createContext({} as CardContext)

export const useCardStateContext = (): CardContext => {
	const context = useContext(CardStateContext)

	if (context === undefined) {
		throw new Error('useCardStateContext must be used within a CardStateProvider')
	}

	return context
}

export const CardStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [cardState, cardDispatch] = useReducer(cardReducer, initialCardState)

	return (
		<CardStateContext.Provider
			value={{
				...cardState,
				cardDispatch
			}}
		>
			{children}
		</CardStateContext.Provider>
	)
}
