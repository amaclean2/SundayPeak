import type { AdventureType, ShortAdventure } from '../../Types/Adventures'
import type { FullZone, ShortZone, ZoneAction, ZoneState } from '../../Types/Zones'

export const initialZoneState = {
	allZones: null,
	closeZones: null,
	currentZone: null,
	zoneError: null
}

export const zoneReducer = (state: ZoneState, action: ZoneAction): ZoneState => {
	switch (action.type) {
		case 'setAllZones':
			return { ...state, allZones: action.payload }
		case 'setCloseZones':
			return { ...state, closeZones: action.payload }
		case 'setCurrentZone':
			return { ...state, currentZone: action.payload }
		case 'setZoneError':
			return { ...state, zoneError: action.payload }
		case 'editZone':
			return {
				...state,
				currentZone: {
					...(state.currentZone as FullZone),
					[action.payload.zoneProperty]: action.payload.zoneValue
				}
			}
		case 'addAdventure':
			return {
				...state,
				currentZone: {
					...(state.currentZone as FullZone),
					adventures: [
						...(state.currentZone?.adventures as ShortAdventure[]),
						action.payload.adventure
					]
				}
			}
		case 'addSubzone':
			return {
				...state,
				currentZone: {
					...(state.currentZone as FullZone),
					zones: [...(state.currentZone?.zones as ShortZone[]), action.payload.zone]
				}
			}
		case 'removeAdventure':
			return {
				...state,
				currentZone: { ...(state.currentZone as FullZone), adventures: action.payload }
			}
		case 'removeSubzone':
			return {
				...state,
				currentZone: { ...(state.currentZone as FullZone), zones: action.payload }
			}
		default:
			return state
	}
}
