import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import { MessageContext } from '../Types/Messages'
import { initialMessagingState, messageReducer } from './Reducers/MessageReducer'

const MessagingStateContext = createContext<MessageContext>({} as MessageContext)

export const useMessagingStateContext = () => {
	const context = useContext(MessagingStateContext)

	if (context === undefined) {
		throw new Error('useMessagingStateContext must be used within a MessagingStateProvider')
	}
	return context
}

export const MessagingStateProvider = ({ children }: { children: ReactNode }) => {
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
