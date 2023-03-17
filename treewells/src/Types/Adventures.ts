import { Dispatch } from 'react'

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
	aspenct: string
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

type SetAllAdventuresType = {
	type: 'setAllAdventures'
	payload: any
}

type SetNewAdventureView = {
	type: 'setNewAdventure'
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
	payload: AdventureType
}

type ChangeAdventureEditState = {
	type: 'changeIsAdventureEditable'
}

type SetAdventureError = {
	type: 'setAdventureError'
	payload: string
}

type SetDeletePageState = {
	type: 'setDeletePageOpen'
}

type DeleteAdventure = {
	type: 'deleteAdventure'
}

type AdventureTypeView = {
	type: 'setAdventureTypeView'
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
	}
	deletePageOpen: boolean
	adventureTypeViewer: AdventureChoiceType
}

export type AdventureContext = AdventureState & { adventureDispatch: Dispatch<AdventureAction> }
