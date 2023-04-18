import React, { createContext, type ReactNode, useContext, useEffect, useReducer } from 'react'
import { Connections, Storage } from '../config'
import { adventures } from '../Hooks/Apis'
import type { AdventureChoiceType, AdventureContext, MapPosition } from '../Types/Adventures'
import { fetcher } from '../utils'
import { adventureReducer, initialAdventureState } from './Reducers/AdventureReducer'

const getStartPos = async (): Promise<{
	position: MapPosition
	adventureType: AdventureChoiceType
}> => {
	const stringifiedStartPos: string | null = (await Storage.getItem('startPos')) as string | null
	const adventureType = (await Storage.getItem('globalAdventureType')) as AdventureChoiceType

	return {
		position: (stringifiedStartPos !== null && JSON.parse(stringifiedStartPos)) ?? {
			latitude: 39.347,
			longitude: -120.194,
			zoom: 10
		},
		adventureType: adventureType ?? 'ski'
	}
}

const AdventureEditContext = createContext({} as AdventureContext)

export const useAdventureStateContext = (): AdventureContext => {
	const context = useContext(AdventureEditContext)

	if (context === undefined) {
		throw new Error('useAdventureStateContext must be used within a AdventureEditProvider')
	}

	return context
}

export const AdventureStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [adventureState, adventureDispatch] = useReducer(adventureReducer, initialAdventureState)

	// update the local browser state of the new start position when it changes
	useEffect(() => {
		if (Connections.isReady) {
			if (adventureState.startPosition !== null) {
				Storage.setItem('startPos', JSON.stringify(adventureState.startPosition))
			} else {
				getStartPos()
					.then(({ position, adventureType }) => {
						adventureDispatch({
							type: 'setInitialValues',
							payload: {
								startPosition: position,
								globalAdventureType: adventureType
							}
						})
					})
					.catch(console.error)
			}
		}
	}, [adventureState.startPosition, Connections.isReady])

	useEffect(() => {
		fetcher(`${adventures.getAllAdventures.url}?type=${adventureState.globalAdventureType}`, {
			method: adventures.getAllAdventures.method
		})
			.then(({ data: { adventures } }) => {
				adventureDispatch({
					type: 'setAllAdventures',
					payload: adventures
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
