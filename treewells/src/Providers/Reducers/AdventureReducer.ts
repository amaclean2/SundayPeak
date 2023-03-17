import { AdventureAction, AdventureChoiceType, AdventureState } from '../../Types/Adventures'

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
	deletePageOpen: false,
	adventureTypeViewer: (localStorage.getItem('adventureTypeViewer') as AdventureChoiceType) || 'ski'
}

export const adventureReducer = (state: AdventureState, action: AdventureAction) => {
	switch (action.type) {
		case 'setAllAdventures':
			return {
				...state,
				allAdventures: action.payload.adventures
			}
		case 'setNewAdventure':
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
				currentAdventure: action.payload
			}
		case 'changeIsAdventureEditable':
			return { ...state, adventureEditState: !state.adventureEditState }
		case 'setAdventureError':
			return { ...state, adventureError: action.payload }
		case 'setDeletePageOpen':
			return { ...state, deletePageOpen: !state.deletePageOpen }
		case 'deleteAdventure':
			return { ...state, deletePageOpen: !state.deletePageOpen, currentAdventure: null }
		case 'setAdventureTypeView':
			localStorage.setItem('adventureTypeViewer', action.payload)
			return { ...state, adventureTypeViewer: action.payload }
		default:
			return state
	}
}
