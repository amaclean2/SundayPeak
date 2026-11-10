import React, { createContext, type ReactNode, useContext, useReducer } from 'react'
import type { MessageContext } from '../Types/Messages'
import { initialMessagingState, messageReducer } from './Reducers/MessageReducer'

const MessagingStateContext = createContext({} as MessageContext)

export const useMessagingStateContext = (): MessageContext => {
	const context = useContext(MessagingStateContext)

	if (context === undefined) {
		throw new Error('useMessagingStateContext must be used within a MessagingStateProvider')
	}
	return context
}

export const MessagingStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [messageState, messageDispatch] = useReducer(messageReducer, initialMessagingState)

	return (
		<MessagingStateContext.Provider
			value={{
				...messageState,
				messageDispatch
			}}
		>
			{children}
		</MessagingStateContext.Provider>
	)
}
