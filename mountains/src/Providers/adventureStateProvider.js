import React, { createContext, useContext, useEffect, useReducer } from 'react'

const AdventureEditContext = createContext()

export const useAdventureStateContext = () => {
	const context = useContext(AdventureEditContext)

	if (context === undefined) {
		throw new Error('useAdventureStateContext must be used within a AdventureEditProvider')
	}

	return context
}

export const AdventureStateProvider = ({ children }) => {
	const initialStartPosition = JSON.parse(localStorage.getItem('startPos')) || {
		latitude: 39.347,
		longitude: -120.194,
		zoom: 10
	}

	const initialAdventureState = {
		allAdventures: [],
		adventureAddState: false,
		currentAdventure: null,
		editAdventureFields: {},
		currentBoundingBox: null,
		isAdventureEditable: false,
		adventureError: null,
		startPosition: initialStartPosition,
		flyTo: false,
		isDeletePage: false,
		saveState: false,
		mapStyle: '',
		adventureTypeViewer: localStorage.getItem('adventureTypeViewer') || 'ski'
	}

	const adventureReducer = (state, action) => {
		switch (action.type) {
			case 'allAdventures':
				return {
					...state,
					allAdventures: action.payload.adventures,
					startPosition: action.payload.startPosition,
					...(action.payload.boundingBox && { currentBoundingBox: action.payload.boundingBox })
				}
			case 'addNewAdventure':
				return {
					...state,
					allAdventures: [
						...state.allAdventures.filter(({ id }) => id !== 'waiting'),
						action.payload
					],
					saveState: !state.saveState,
					currentAdventure: null
				}
			case 'newAdventurePanel':
				return {
					...state,
					allAdventures: action.payload.adventures,
					currentAdventure: action.payload.currentAdventure,
					adventureAddState: false
				}
			case 'toggleAdventureAddState':
				// screen for adding a new adventure
				return { ...state, adventureAddState: !state.adventureAddState }
			case 'currentAdventure':
				return { ...state, currentAdventure: action.payload }
			case 'validateAdventure':
				return {
					...state,
					currentAdventure: action.payload.currentAdventure,
					editAdventureFields: action.payload.editAdventureFields
				}
			case 'closeAdventurePanel':
				return {
					...state,
					adventureAddState: false,
					currentAdventure: null,
					isAdventureEditable: false,
					isDeletePage: false
				}
			case 'editAdventure':
				return {
					...state,
					editAdventureFields: action.payload.editAdventureFields,
					currentAdventure: action.payload.currentAdventure
				}
			case 'boundingBox':
				return { ...state, currentBoundingBox: action.payload }
			case 'toggleAdventureEditable':
				return { ...state, isAdventureEditable: !state.isAdventureEditable }
			case 'adventureError':
				return { ...state, adventureError: action.payload }
			case 'adventureErrorOnSave':
				return { ...state, isAdventureEditable: true, adventureError: action.payload }
			case 'flyTo':
				return { ...state, flyTo: action.payload }
			case 'stopFlying':
				return { ...state, flyTo: false }
			case 'toggleDeletePage':
				return { ...state, isDeletePage: !state.isDeletePage }
			case 'deleteAdventure':
				return { ...state, isDeletePage: !state.isDeletePage, currentAdventure: null }
			case 'toggleSaveState':
				return { ...state, saveState: !state.saveState }
			case 'exitEdit':
				return { ...state, saveState: false, isAdventureEditable: false }
			case 'toggleEdit':
				return {
					...state,
					saveState: !state.saveState,
					isAdventureEditable: !state.isAdventureEditable
				}
			case 'mapStyle':
				return { ...state, mapStyle: action.payload }
			case 'adventureTypeViewer':
				localStorage.setItem('adventureTypeViewer', action.payload)
				return { ...state, adventureTypeViewer: action.payload }
			default:
				return state
		}
	}

	const [adventureState, adventureDispatch] = useReducer(adventureReducer, initialAdventureState)

	// update the local browser state of the new start position when it changes
	useEffect(() => {
		adventureState?.startPosition &&
			localStorage.setItem('startPos', JSON.stringify(adventureState.startPosition))
	}, [adventureState?.startPosition])

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
