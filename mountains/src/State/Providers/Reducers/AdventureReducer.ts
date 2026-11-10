import { Storage } from '../../config'
import type { AdventureAction, AdventureState, AdventureType } from '../../Types/Adventures'
import type { URLType } from '../../Types/Cards'

export const initialAdventureState: AdventureState = {
	allAdventures: null, // all the adventures in a geoJSON object that gets fed to the map
	closeAdventures: null, // a list of the close adventures to the current point
	adventureAddState: false, // a false zone or adventure value that tells the map when a marker or zone is being added
	currentAdventure: null, // the adventure currently being drawn
	adventureError: null, // Any error when creating or editing an adventure
	startPosition: null, // The initial position when loading the map
	isDeletePageOpen: false, // A boolean that controls the delete modal (should probably be in cards)
	globalAdventureType: null, // The adventure type selected in the app
	isPathEditOn: false, // a boolean that tells the map when a path is being drawn
	workingPath: { path: [], elevations: [], maxEl: 0, minEl: 0, points: [] }, // the path being edited
	matchPath: false, // a check to see if the saved path should match any roads
	zoneAdd: null // if this variable is present, after creating a new adventure, add that adventure to this zone
}

export const adventureReducer = (
	state: AdventureState,
	action: AdventureAction
): AdventureState => {
	switch (action.type) {
		case 'setInitialValues':
			Storage.setItem('startPos', JSON.stringify(action.payload.startPosition))
			return {
				...state,
				startPosition: action.payload.startPosition,
				globalAdventureType: action.payload.globalAdventureType
			}
		case 'setCloseAdventures':
			return {
				...state,
				closeAdventures: action.payload
			}
		case 'updateStartPosition':
			Storage.setItem('startPos', JSON.stringify(action.payload))
			return {
				...state,
				startPosition: action.payload
			}
		case 'setAllAdventures':
			return {
				...state,
				allAdventures: action.payload
			}
		case 'addNewAdventure':
			return {
				...state,
				allAdventures: action.payload.adventures,
				currentAdventure: action.payload.currentAdventure,
				adventureAddState: false
			}
		case 'toggleAdventureAddState':
			return {
				...state,
				adventureAddState: action.payload
			}
		case 'togglePathEdit':
			return {
				...state,
				isPathEditOn: action.payload !== undefined ? action.payload : !state.isPathEditOn
			}
		case 'setCurrentAdventure':
			return { ...state, currentAdventure: action.payload }
		case 'toggleMatchPath':
			return {
				...state,
				matchPath: action.payload !== undefined ? action.payload : !state.matchPath
			}
		case 'closeAdventureView':
			return {
				...state,
				adventureAddState: false,
				currentAdventure: null,
				isDeletePageOpen: false,
				workingPath: { path: [], elevations: [], points: [], maxEl: 0, minEl: 0 }
			}
		case 'editAdventure':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					[action.payload.name]: action.payload.value
				}
			}
		case 'toggleZoneAdd':
			return {
				...state,
				zoneAdd: action.payload !== undefined ? action.payload : null
			}
		/**
		 * startNewAdventureProcess is triggered when the adventure type is selected
		 * from the dropdown on creating a new adventure.
		 * It's also enabled when the toggle of adventure types is selected, so I'm not sure this is the best place for
		 * adventureAddState to be changed
		 */
		case 'startNewAdventureProcess':
			Storage.setItem('globalAdventureType', action.payload.type)
			return {
				...state,
				globalAdventureType: action.payload.type,
				adventureAddState: action.payload.isZone ? 'zone' : 'adventure'
			}
		case 'setAdventureError':
			return { ...state, adventureError: action.payload }
		case 'toggleIsDeletePageOpen':
			return {
				...state,
				isDeletePageOpen: action.payload !== undefined ? action.payload : !state.isDeletePageOpen
			}
		case 'deleteAdventure':
			return { ...state, isDeletePageOpen: !state.isDeletePageOpen, currentAdventure: null }
		case 'setGlobalAdventureType':
			Storage.setItem('globalAdventureType', action.payload)
			return { ...state, globalAdventureType: action.payload }
		case 'updateAdventureImages':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					images: [...(state.currentAdventure?.images as URLType[]), action.payload]
				}
			}
		case 'deleteAdventureImage':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					images: (state.currentAdventure?.images as URLType[])?.filter(
						(image) => image !== action.payload
					)
				}
			}
		case 'updateTrailPath':
			return {
				...state,
				workingPath: {
					...state.workingPath,
					...action.payload
				}
			}
		case 'clearTrailPath':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					path: [],
					elevations: [],
					points: []
				},
				workingPath: { path: [], elevations: [], points: [], maxEl: 0, minEl: 0 }
			}
		default:
			return state
	}
}
