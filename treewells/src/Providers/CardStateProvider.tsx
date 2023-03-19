import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import { CardContext } from '../Types/Cards'
import { cardReducer, initialCardState } from './Reducers/CardReducer'

const CardStateContext = createContext<CardContext>({} as CardContext)

export const useCardStateContext = () => {
	const context = useContext(CardStateContext)

	if (context === undefined) {
		throw new Error('useCardStateContext must be used within a CardStateProvider')
	}

	return context
}

export const CardStateProvider = ({ children }: { children: ReactNode }) => {
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
