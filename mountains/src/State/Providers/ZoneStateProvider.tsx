import React, { createContext, type ReactNode, useContext, useReducer } from 'react'
import type { ZoneContext } from '../Types/Zones'
import { initialZoneState, zoneReducer } from './Reducers/ZoneReducer'

const ZoneStateContext = createContext({} as ZoneContext)

export const useZoneStateContext = (): ZoneContext => {
	const context = useContext(ZoneStateContext)

	if (context === undefined) {
		throw new Error('useZoneStateContext must be used within a ZoneStateProvider')
	}

	return context
}

export const ZoneStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [zoneState, zoneDispatch] = useReducer(zoneReducer, initialZoneState)

	return (
		<ZoneStateContext.Provider
			value={{
				...zoneState,
				zoneDispatch
			}}
		>
			{children}
		</ZoneStateContext.Provider>
	)
}
