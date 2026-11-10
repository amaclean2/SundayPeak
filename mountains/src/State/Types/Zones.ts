import type { Dispatch } from 'react'
import type {
	AdventureChoiceType,
	AdventureType,
	BreadcrumbElement,
	ShortAdventure
} from './Adventures'
import type { ShortUser } from './User'
import { URLType } from './Cards'

export type ZoneState = {
	allZones: ZoneGeoJSONObj | null
	closeZones: ShortZone[] | null
	currentZone: FullZone | null
	zoneError: string | null
}

export type ShortZone = {
	zone_id: number
	zone_name: string
	adventure_type: AdventureType
	nearest_city: string
	coordinates: {
		lat: number
		lng: number
	}
}

type ZoneGeoJSONGeometry = {
	type: 'Point'
	coordinates: number[]
}

type ZoneGeoJSONFeature = {
	type: 'Feature'
	properties: Record<string, undefined>
	geometry: ZoneGeoJSONGeometry
}

export type ZoneGeoJSONObj = {
	type: 'FeatureCollection'
	features: ZoneGeoJSONFeature[]
}

export type ZoneSearchElement = {
	zone_id: number
	zone_name: string
	adventure_type: AdventureChoiceType
	nearest_city: string
}

type SetAllZones = {
	type: 'setAllZones'
	payload: ZoneGeoJSONObj
}

type SetCloseZones = {
	type: 'setCloseZones'
	payload: ShortZone[]
}

type SetCurrentZone = {
	type: 'setCurrentZone'
	payload: FullZone | null
}

type EditZone = {
	type: 'editZone'
	payload: {
		zoneProperty: string
		zoneValue: string | number
	}
}

type AddAdventure = {
	type: 'addAdventure'
	payload: {
		adventure: ShortAdventure
	}
}

type AddSubzone = {
	type: 'addSubzone'
	payload: {
		zone: ShortZone
	}
}

type RemoveAdventure = {
	type: 'removeAdventure'
	payload: ShortAdventure[]
}

type RemoveSubzone = {
	type: 'removeSubzone'
	payload: ShortZone[]
}

type SetZoneError = {
	type: 'setZoneError'
	payload: string
}

export type FullZone = {
	id: number
	zone_name: string
	adventure_type: AdventureChoiceType
	bio: string
	appraoch: string
	nearest_city: string
	date_created: number
	creator: ShortUser
	coordinates: {
		lat: number
		lng: number
	}
	public: boolean
	adventures: ShortAdventure[]
	zones: ShortZone[]
	breadcrumb: BreadcrumbElement[]
	images: URLType[]
}

export type DefaultZone = {
	zone_name: string
	adventure_type: AdventureChoiceType
	public: boolean
	nearest_city: string
	coordinates: {
		lat: number
		lng: number
	}
}

export type ZoneAction =
	| SetAllZones
	| SetCloseZones
	| SetCurrentZone
	| SetZoneError
	| EditZone
	| AddAdventure
	| AddSubzone
	| RemoveAdventure
	| RemoveSubzone

export type ZoneContext = ZoneState & { zoneDispatch: Dispatch<ZoneAction> }
