import {
	AdventureAction,
	AdventureChoiceType,
	AdventureState,
	AdventureType
} from '../../Types/Adventures'

const getStartPos = () => {
	const stringifiedStartPos = localStorage.getItem('startPos')
	return (
		(typeof stringifiedStartPos === 'string' && JSON.parse(stringifiedStartPos)) || {
			latitude: 39.347,
			longitude: -120.194,
			zoom: 10
		}
	)
}

export const initialAdventureState = {
	allAdventures: null,
	adventureAddState: false,
	currentAdventure: null,
	adventureEditState: false,
	adventureError: null,
	startPosition: getStartPos(),
	isDeletePageOpen: false,
	globalAdventureType: (localStorage.getItem('globalAdventureType') as AdventureChoiceType) || 'ski'
}

export const adventureReducer = (state: AdventureState, action: AdventureAction) => {
	switch (action.type) {
		case 'updateStartPosition':
			localStorage.setItem('startPos', JSON.stringify(action.payload))
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
				deletePageOpen: false
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
			localStorage.setItem('globalAdventureType', action.payload)
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
			localStorage.setItem('globalAdventureType', action.payload)
			return { ...state, globalAdventureType: action.payload }
		default:
			return state
	}
}
