import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'
import { adventures } from '../Hooks/Apis'
import { AdventureContext } from '../Types/Adventures'
import { fetcher } from '../utils'
import { adventureReducer, initialAdventureState } from './Reducers/AdventureReducer'

const AdventureEditContext = createContext<AdventureContext>({} as AdventureContext)

export const useAdventureStateContext = () => {
	const context = useContext(AdventureEditContext)

	if (context === undefined) {
		throw new Error('useAdventureStateContext must be used within a AdventureEditProvider')
	}

	return context
}

export const AdventureStateProvider = ({ children }: { children: ReactNode }) => {
	const [adventureState, adventureDispatch] = useReducer(adventureReducer, initialAdventureState)

	// update the local browser state of the new start position when it changes
	useEffect(() => {
		adventureState?.startPosition &&
			localStorage.setItem('startPos', JSON.stringify(adventureState.startPosition))
	}, [adventureState?.startPosition])

	useEffect(() => {
		fetcher(`${adventures.getAllAdventures.url}?type=${adventureState.adventureTypeViewer}`, {
			method: adventures.getAllAdventures.method
		})
			.then(({ data: { adventures } }) => {
				adventureDispatch({
					type: 'setAllAdventures',
					payload: { adventures }
				})

				return adventures
			})
			.catch(console.error)
	}, [])

	return (
		<AdventureEditContext.Provider
			value={{
				...adventureState,
				adventureDispatch
			}}
		>
			{children}
		</AdventureEditContext.Provider>
	)
}
