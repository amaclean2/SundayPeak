import type { Dispatch } from 'react'

export type AdventureChoiceType = 'ski' | 'climb' | 'hike'

type CompletedUserType = {
	adventure_id: number
	email: string
	display_name: string
	profile_picture_url: string | null
	user_id: number
}

type TodoUserType = {
	display_name: string
	email: string
	profile_picture_url: string | null
	user_id: number
}

type AdventureFeature = {
	type: 'Feature'
	geometry: {
		type: 'Point'
		coordinates: number[]
	}
	properties: {
		adventure_name: string
		adventure_type: AdventureChoiceType
		id: number
		public: boolean
	}
}

export type AdventureList = {
	type: 'FeatureCollection'
	features: AdventureFeature[]
}

type BasicAdventureType = {
	adventure_name: string
	adventure_type: AdventureChoiceType
	bio?: string
	completed_users: CompletedUserType[]
	todo_users: TodoUserType[]
	coordinates: {
		lat: number
		lng: number
	}
	creator_email?: string
	creator_id: number
	creator_name: string
	date_created: string
	id: number
	images: string[]
	nearest_city: string
	public: boolean
	rating: number
}

type SkiAdventureType = BasicAdventureType & {
	approach_distance: string
	aspect: string
	avg_angle: number
	max_angle: number
	base_elevation: number
	summit_elevaiton: number
	difficulty: number
	exposure: number
	gear: string
	season: string
}

type ClimbAdventureType = BasicAdventureType & {
	approach: string
	climb_type: string
	first_ascent: string
	grade: string
	pitches: number
	protection: string
	season: string
}

type HikeAdventureType = BasicAdventureType & {
	base_elevation: number
	summit_elevation: number
	difficulty: number
	distance: number
	season: string
}

export type AdventureType = SkiAdventureType | ClimbAdventureType | HikeAdventureType
export type MapPosition = {
	longitude: number
	latitude: number
	zoom: number
}

type SetAllAdventuresType = {
	type: 'setAllAdventures'
	payload: AdventureList
}

type SetNewAdventureView = {
	type: 'addNewAdventure'
	payload: {
		adventures: AdventureList
		currentAdventure: AdventureType
	}
}

type MapDoubleClickEnabled = {
	type: 'enableMapDoubleClick'
}

type SetCurrentAdventure = {
	type: 'setCurrentAdventure'
	payload: AdventureType
}

type CloseAdventureView = {
	type: 'closeAdventureView'
}

type EditAdventure = {
	type: 'editAdventure'
	payload: {
		name: string
		value: string
	}
}

type ChangeAdventureEditState = {
	type: 'switchIsAdventureEditable'
}

type SetAdventureError = {
	type: 'setAdventureError'
	payload: string
}

type SetDeletePageState = {
	type: 'switchIsDeletePageOpen'
}

type DeleteAdventure = {
	type: 'deleteAdventure'
}

type UpdateStartPosition = {
	type: 'updateStartPosition'
	payload: MapPosition
}

type AdventureTypeView = {
	type: 'setGlobalAdventureType'
	payload: AdventureChoiceType
}

type SetInitialValues = {
	type: 'setInitialValues'
	payload: {
		startPosition: MapPosition
		globalAdventureType: AdventureChoiceType
	}
}

type NewAdventureProcess = {
	type: 'startNewAdventureProcess'
	payload: AdventureChoiceType
}

export type AdventureAction =
	| SetAllAdventuresType
	| SetNewAdventureView
	| MapDoubleClickEnabled
	| SetCurrentAdventure
	| CloseAdventureView
	| EditAdventure
	| ChangeAdventureEditState
	| SetAdventureError
	| SetDeletePageState
	| DeleteAdventure
	| AdventureTypeView
	| NewAdventureProcess
	| UpdateStartPosition
	| SetInitialValues

export type AdventureState = {
	allAdventures: AdventureList | null
	adventureAddState: boolean
	currentAdventure: AdventureType | null
	adventureEditState: boolean
	adventureError: null | string
	startPosition: {
		latitude: number
		longitude: number
		zoom: number
	} | null
	isDeletePageOpen: boolean
	globalAdventureType: AdventureChoiceType
}

export type AdventureContext = AdventureState & { adventureDispatch: Dispatch<AdventureAction> }
