import type { AdventureChoiceType } from '../../../Types/Adventures'
import type { FullZone } from '../../../Types/Zones'
import type { EventChoiceTypes } from '../../Users'

export type GetNearbyZones = ({
	type,
	coordinates,
	count,
	parentId
}: {
	type: AdventureChoiceType
	coordinates: { lat: number; lng: number }
	count: number
	parentId?: number
}) => Promise<void>

export type GetZone = ({ id }: { id: number }) => Promise<void>

export type EditZone = (event: EventChoiceTypes) => Promise<void>

export type EditCoordiantes = (coordinates: { lat: number; lng: number }) => Promise<void>

export type CreatenewDefaultZone = (coordinates: { lat: number; lng: number }) => Promise<FullZone>

export type AddAdventureToZone = ({
	parentId,
	adventureId
}: {
	parentId: number
	adventureId: number
}) => Promise<void>

export type AddChildZone = ({
	parentId,
	childId
}: {
	parentId: number
	childId: number
}) => Promise<void>
