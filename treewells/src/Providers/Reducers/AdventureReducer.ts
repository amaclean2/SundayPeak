import { Storage } from '../../config'
import type {
	AdventureAction,
	AdventureChoiceType,
	AdventureState,
	AdventureType
} from '../../Types/Adventures'

export const initialAdventureState = {
	allAdventures: null,
	adventureAddState: false,
	currentAdventure: null,
	adventureEditState: false,
	adventureError: null,
	startPosition: {
		latitude: 0,
		longitude: 0,
		zoom: 10
	},
	isDeletePageOpen: false,
	globalAdventureType: 'ski' as AdventureChoiceType
}

export const adventureReducer = (
	state: AdventureState,
	action: AdventureAction
): AdventureState => {
	switch (action.type) {
		case 'setInitialValues':
			return {
				...state,
				startPosition: action.payload.startPosition,
				globalAdventureType: action.payload.globalAdventureType
			}
		case 'updateStartPosition':
			void Storage.setItem('startPos', JSON.stringify(action.payload))
			return {
				...state,
				startPosition: action.payload
			}
		case 'setAllAdventures':
			return {
				...state,
				allAdventures: action.payload.adventures
			}
		case 'addNewAdventure':
			return {
				...state,
				allAdventures: action.payload.adventures,
				currentAdventure: action.payload.currentAdventure,
				adventureAddState: false
			}
		case 'enableMapDoubleClick':
			// screen for adding a new adventure
			return { ...state, adventureAddState: true }
		case 'setCurrentAdventure':
			return { ...state, currentAdventure: action.payload }
		case 'closeAdventureView':
			return {
				...state,
				adventureAddState: false,
				currentAdventure: null,
				adventureEditState: false,
				isDeletePageOpen: false
			}
		case 'editAdventure':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					[action.payload.name]: action.payload.value
				}
			}
		case 'startNewAdventureProcess':
			void Storage.setItem('globalAdventureType', action.payload)
			return {
				...state,
				globalAdventureType: action.payload,
				adventureAddState: true
			}
		case 'switchIsAdventureEditable':
			return { ...state, adventureEditState: !state.adventureEditState }
		case 'setAdventureError':
			return { ...state, adventureError: action.payload }
		case 'switchIsDeletePageOpen':
			return { ...state, isDeletePageOpen: !state.isDeletePageOpen }
		case 'deleteAdventure':
			return { ...state, isDeletePageOpen: !state.isDeletePageOpen, currentAdventure: null }
		case 'setGlobalAdventureType':
			void Storage.setItem('globalAdventureType', action.payload)
			return { ...state, globalAdventureType: action.payload }
		default:
			return state
	}
}
