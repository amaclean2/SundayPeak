import type { Dispatch } from 'react'
import type { URLType } from './Cards'
import type { ShortUser } from './User'

export type AdventureChoiceType = 'ski' | 'climb' | 'hike' | 'bike' | 'skiApproach'

export type ShortAdventure = {
	adventure_id: number
	adventure_name: string
	adventure_type: AdventureChoiceType
	difficulty: string
	rating: string
	nearest_city: string
	coordinates: {
		lat: number
		lng: number
	}
	path?: TrailPath
}

export type DefaultAdventure = {
	adventure_name: string
	adventure_type: AdventureChoiceType
	nearest_city: string
	coordinates: {
		lat: number
		lng: number
	}
	difficulty?: string
	rating?: string
	public: boolean
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

type AdventureList = {
	type: 'FeatureCollection'
	features: AdventureFeature[]
}

export type AdventureCategory = {
	ski?: PointsLineDifferentiator
	climb?: PointsLineDifferentiator
	hike?: PointsLineDifferentiator
	bike?: PointsLineDifferentiator
	skiApproach?: PointsLineDifferentiator
}

type PointsLineDifferentiator = {
	points?: AdventureList[]
	lines?: AdventureList[]
}

export type BreadcrumbElement = {
	id: number
	name: string
	category_type: 'adventure' | 'zone'
}

type BasicAdventureType = {
	adventure_name: string
	adventure_type: AdventureChoiceType
	bio?: string
	breadcrumb?: BreadcrumbElement[]
	completed_users?: ShortUser[]
	todo_users?: ShortUser[]
	coordinates: {
		lat: number
		lng: number
	}
	creator: ShortUser
	date_created: number
	id?: number
	images?: URLType[]
	nearest_city: string
	public: boolean
	difficulty?: string
	rating?: string
}

type PathAdventureType = {
	points?: TrailPath
	path?: TrailPath
	elevations?: ElevationCoordinates
	summit_elevation?: number
	base_elevation?: number
}

type SkiAdventureType = BasicAdventureType &
	PathAdventureType & {
		aspect?: string
		avg_angle?: number
		max_angle?: number
		exposure?: number
		season?: string
		ski_approach_id?: number
	}

type SkiApproachType = BasicAdventureType &
	PathAdventureType & {
		distance?: number
		gear?: string
	}

type ClimbAdventureType = BasicAdventureType & {
	distance?: number
	approach: string
	climb_type: string
	first_ascent: string
	pitches: number
	protection: string
	season: string
}

type HikeAdventureType = BasicAdventureType &
	PathAdventureType & {
		distance?: number
		season?: string
	}

type BikeAdventureType = BasicAdventureType &
	PathAdventureType & {
		distance?: number
		season?: string
		climb?: number
		descent?: number
	}

export type AdventureType =
	| SkiAdventureType
	| SkiApproachType
	| ClimbAdventureType
	| HikeAdventureType
	| BikeAdventureType

export type MapPosition = {
	lng: number
	lat: number
	zoom: number
}

export type PathCoordinates = [number, number] | [0]
type ElevationCoordinate = [number, number]

export type TrailPath = PathCoordinates[]
export type ElevationCoordinates = ElevationCoordinate[]

type SetAllAdventuresType = {
	type: 'setAllAdventures'
	payload: AdventureCategory
}

type SetNewAdventureView = {
	type: 'addNewAdventure'
	payload: {
		adventures: AdventureCategory
		currentAdventure: AdventureType
	}
}

type MapDoubleClickEnabled = {
	type: 'enableMapDoubleClick'
}

type SetCurrentAdventure = {
	type: 'setCurrentAdventure'
	payload: AdventureType | null
}

type CloseAdventureView = {
	type: 'closeAdventureView'
}

type EditAdventure = {
	type: 'editAdventure'
	payload: {
		name: string
		value: string | TrailPath
	}
}

type SetAdventureError = {
	type: 'setAdventureError'
	payload: string
}

type ToggleDeletePage = {
	type: 'toggleIsDeletePageOpen'
	payload?: boolean
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
	payload: { type: AdventureChoiceType; isZone: boolean }
}

type UpdateAdventureImages = {
	type: 'updateAdventureImages'
	payload: URLType
}

type DeleteAdventureImageType = {
	type: 'deleteAdventureImage'
	payload: URLType
}

type TogglePathEdit = {
	type: 'togglePathEdit'
	payload?: boolean
}

type UpdateTrailPath = {
	type: 'updateTrailPath'
	payload: {
		path?: TrailPath
		points?: TrailPath
		elevations?: ElevationCoordinates
		maxEl?: number
		minEl?: number
	}
}

type SetCloseAdventures = {
	type: 'setCloseAdventures'
	payload: ShortAdventure[]
}

type SetAdventuresList = {
	type: 'setAdventuresList'
	payload: ShortAdventure[]
}

type ToggleMatchPath = {
	type: 'toggleMatchPath'
	payload?: boolean
}

type ClearTrailPath = {
	type: 'clearTrailPath'
}

type ToggleAdventureAddState = {
	type: 'toggleAdventureAddState'
	payload: false | 'zone' | 'adventure'
}

type ToggleZoneAdd = {
	type: 'toggleZoneAdd'
	payload?: number | null
}

export type AdventureAction =
	| SetAllAdventuresType
	| SetNewAdventureView
	| MapDoubleClickEnabled
	| SetCurrentAdventure
	| CloseAdventureView
	| EditAdventure
	| SetAdventureError
	| ToggleDeletePage
	| DeleteAdventure
	| AdventureTypeView
	| NewAdventureProcess
	| UpdateStartPosition
	| SetInitialValues
	| UpdateAdventureImages
	| DeleteAdventureImageType
	| TogglePathEdit
	| UpdateTrailPath
	| SetCloseAdventures
	| SetAdventuresList
	| ToggleMatchPath
	| ClearTrailPath
	| ToggleAdventureAddState
	| ToggleZoneAdd

export type AdventureState = {
	allAdventures: AdventureCategory | null
	closeAdventures: ShortAdventure[] | null
	adventureAddState: false | 'zone' | 'adventure'
	currentAdventure: AdventureType | null
	adventureError: null | string
	isPathEditOn: boolean
	startPosition: {
		lat: number
		lng: number
		zoom: number
	} | null
	isDeletePageOpen: boolean
	globalAdventureType: AdventureChoiceType | null
	workingPath: {
		path: TrailPath
		elevations: ElevationCoordinates
		points: TrailPath
		maxEl: number
		minEl: number
	}
	matchPath: boolean
	zoneAdd: number | null
}

export type AdventureContext = AdventureState & { adventureDispatch: Dispatch<AdventureAction> }
