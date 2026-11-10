import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import type {
	AdventureChoiceType,
	AdventureType,
	DefaultAdventure,
	ElevationCoordinates,
	TrailPath
} from '../../Types/Adventures'
import { fetcher, useDebounce } from '../../utils'
import { adventuresApi, zonesApi } from '../Apis'
import type { EventChoiceTypes } from '../Users'

export const useGetAdventures = (): {
	getAdventure: ({ id, type }: { id: number; type: AdventureChoiceType }) => Promise<void>
	getAllAdventures: ({ type }: { type: AdventureChoiceType }) => Promise<void>
	shareAdventure: () => Promise<void>
	getNearbyAdventures: ({
		type,
		coordinates,
		count,
		zoneId
	}: {
		type: AdventureChoiceType
		coordinates: { lat: number; lng: number }
		count?: number
		zoneId?: number
	}) => Promise<void>
	changeAdventureType: ({ type }: { type: AdventureChoiceType }) => void
	enableNewAdventureClick: ({
		type,
		isZone
	}: {
		type: AdventureChoiceType
		isZone: boolean
	}) => void
	processCsvAdventures: ({ csvString }: { csvString: string }) => Promise<AdventureType[]>
	clearCurrentAdventure: () => void
} => {
	const { globalAdventureType, adventureDispatch } = useAdventureStateContext()
	const { updatePath } = useSaveAdventure()

	const getAdventure = async ({
		id,
		type
	}: {
		id: number
		type: AdventureChoiceType
	}): Promise<void> => {
		if (id === undefined || type === undefined)
			adventureDispatch({ type: 'setAdventureError', payload: 'id and type fields are required' })

		try {
			const {
				data: { adventure }
			} = await fetcher(`${adventuresApi.getAdventureDetails.url}?id=${id}&type=${type}`, {
				method: adventuresApi.getAdventureDetails.method
			})

			adventureDispatch({ type: 'setCurrentAdventure', payload: adventure })

			if (adventure.path !== undefined && adventure.path.length !== 0) {
				const maxEl = Number(
					Math.max(...adventure.elevations?.map((el: [number, number]) => el[0])).toFixed(0)
				)
				const minEl = Number(
					Math.min(...adventure.elevations.map((el: [number, number]) => el[0])).toFixed(0)
				)
				const adventurePoints =
					adventure.points !== undefined && adventure.points.length > 0 ? adventure.points : []

				updatePath({
					path: adventure.path,
					points: adventurePoints,
					elevations: adventure.elevations,
					maxEl,
					minEl
				})
			}
		} catch (error) {
			adventureDispatch({
				type: 'setAdventureError',
				payload: 'error fetching adventure, please try again or do some other stuff...'
			})

			throw error
		}
	}

	const getNearbyAdventures = async ({
		type,
		coordinates,
		count = 10,
		zoneId
	}: {
		type: AdventureChoiceType
		coordinates: { lat: number; lng: number }
		count?: number
		zoneId?: number
	}): Promise<void> => {
		try {
			const zoneBlock = zoneId !== undefined ? `&zone_id=${zoneId}` : ''
			const assembledUrl = `${adventuresApi.getAdventuresByDistance.url}?type=${
				type ?? globalAdventureType
			}&lat=${coordinates.lat}&lng=${coordinates.lng}&count=${count}${zoneBlock}`

			const {
				data: { adventures: closeAdventures }
			} = await fetcher(assembledUrl, { method: adventuresApi.getAdventuresByDistance.method })

			adventureDispatch({ type: 'setCloseAdventures', payload: closeAdventures })
		} catch (error) {}
	}

	const changeAdventureType = ({ type }: { type: AdventureChoiceType }): void => {
		adventureDispatch({ type: 'setGlobalAdventureType', payload: type })
		// I'm replacing getAllAdventures here with a watcher in adventureStateContext
		// that calls getAllAdventures anytime the globalAdventureState changes
	}

	const enableNewAdventureClick = ({
		type,
		isZone
	}: {
		type: AdventureChoiceType
		isZone: boolean
	}): void => {
		adventureDispatch({ type: 'startNewAdventureProcess', payload: { type, isZone } })
	}

	// get all the adventures of a type
	const getAllAdventures = async ({ type }: { type: AdventureChoiceType }): Promise<void> => {
		try {
			const adventureType = type ?? globalAdventureType
			const {
				data: { adventures: payload }
			} = await fetcher(
				`${adventuresApi.getAllAdventures.url}?type=${
					adventureType === 'skiApproach' ? 'ski' : adventureType
				}`,
				{
					method: adventuresApi.getAllAdventures.method
				}
			)

			adventureDispatch({ type: 'setAllAdventures', payload })
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'failed fetching adventures' })
			throw error
		}
	}

	const processCsvAdventures = async ({
		csvString
	}: {
		csvString: string
	}): Promise<AdventureType[]> => {
		try {
			const { data } = await fetcher(adventuresApi.processAdventureCSV.url, {
				method: adventuresApi.processAdventureCSV.method,
				body: { csvString }
			})

			return data.adventures
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not process csv data' })
			throw error
		}
	}

	const clearCurrentAdventure = (): void => {
		adventureDispatch({ type: 'setCurrentAdventure', payload: null })
	}

	// placeholder: sharing isn't implemented yet (matches published 1.6.51)
	const shareAdventure = async (): Promise<void> => {}

	return {
		getAdventure,
		getNearbyAdventures,
		shareAdventure,
		getAllAdventures,
		changeAdventureType,
		processCsvAdventures,
		enableNewAdventureClick,
		clearCurrentAdventure
	}
}

export const useSaveAdventure = (): {
	editAdventure: (event: EventChoiceTypes) => Promise<void>
	editCoordinates: (coordinates: { lat: number; lng: number }) => Promise<void>
	createNewDefaultAdventure: ({ lat, lng }: { lat: number; lng: number }) => Promise<AdventureType>
	toggleZoneAdd: (parentZoneId?: number | null) => void
	insertBulkAdventures: ({
		adventuresObject
	}: {
		adventuresObject: AdventureType[]
	}) => Promise<void>
	setAdventureError: (adventureError: string) => void
	togglePathEdit: (val?: boolean) => void
	toggleMatchPath: (val?: boolean) => void
	savePath: () => Promise<void>
	removeAdventureFromArea: ({
		parentId,
		childId
	}: {
		parentId: number
		childId: number
	}) => Promise<void>
	removeAreaFromArea: ({
		parentId,
		childId
	}: {
		parentId: number
		childId: number
	}) => Promise<void>
	updatePath: ({
		path,
		elevations,
		points,
		minEl,
		maxEl
	}: {
		path?: TrailPath
		points?: TrailPath
		elevations?: ElevationCoordinates
		maxEl?: number
		minEl?: number
	}) => void
	deletePath: () => Promise<void>
	toggleAdventureAddState: (val: false | 'adventure' | 'zone') => void
} => {
	const { adventureDispatch, currentAdventure, globalAdventureType, workingPath } =
		useAdventureStateContext()

	const saveEditAdventure = useDebounce(
		async ({ name, value }: { name: string; value: string | number }): Promise<void> => {
			try {
				return await fetcher(adventuresApi.editAdventure.url, {
					method: adventuresApi.editAdventure.method,
					body: {
						field: {
							name,
							value,
							adventure_id: currentAdventure?.id,
							adventure_type: currentAdventure?.adventure_type
						}
					}
				})
			} catch (error) {
				adventureDispatch({ type: 'setAdventureError', payload: 'could not edit adventure' })
				throw error
			}
		}
	)

	const editCoordinates = async (coordinates: { lat: number; lng: number }): Promise<void> => {
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: 'coordiantes',
				value: JSON.stringify([coordinates.lng, coordinates.lat])
			}
		})

		const {
			data: { all_adventures: payload }
		} = await fetcher(adventuresApi.editAdventure.url, {
			method: adventuresApi.editAdventure.method,
			body: {
				field: {
					name: 'coordinates',
					value: [coordinates.lng, coordinates.lat],
					adventure_id: currentAdventure?.id,
					adventure_type: currentAdventure?.adventure_type
				}
			}
		})

		adventureDispatch({ type: 'setAllAdventures', payload })
	}

	const editAdventure = async (event: EventChoiceTypes): Promise<void> => {
		// event is the adventure value
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: event.target.name,
				value: event.target.value
			}
		})

		await saveEditAdventure({ name: event.target.name, value: event.target.value })
	}

	const savePath = async (): Promise<void> => {
		await fetcher(adventuresApi.editAdventurePath.url, {
			method: adventuresApi.editAdventurePath.method,
			body: {
				field: {
					adventure_id: currentAdventure?.id,
					adventure_type: currentAdventure?.adventure_type,
					path: [...workingPath.path, [0], ...workingPath.points],
					elevations: workingPath.elevations
				}
			}
		})

		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: 'path',
				value: workingPath.path
			}
		})
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: 'points',
				value: workingPath.points
			}
		})
	}

	const toggleAdventureAddState = (val: false | 'adventure' | 'zone'): void => {
		adventureDispatch({
			type: 'toggleAdventureAddState',
			payload: val
		})
	}

	const toggleZoneAdd = (parentZoneId?: number | null): void => {
		if (parentZoneId !== undefined)
			adventureDispatch({ type: 'toggleZoneAdd', payload: parentZoneId })
		else adventureDispatch({ type: 'toggleZoneAdd' })
	}

	const deletePath = async (): Promise<void> => {
		await fetcher(
			`${adventuresApi.deletePath.url}?adventure_id=${
				currentAdventure?.id as number
			}&adventure_type=${currentAdventure?.adventure_type as string}`,
			{
				method: adventuresApi.deletePath.method
			}
		)
		adventureDispatch({ type: 'clearTrailPath' })
	}

	const updatePath = ({
		path,
		points,
		elevations,
		maxEl,
		minEl
	}: {
		path?: TrailPath
		points?: TrailPath
		elevations?: ElevationCoordinates
		maxEl?: number
		minEl?: number
	}): void =>
		adventureDispatch({
			type: 'updateTrailPath',
			payload: { path, points, elevations, maxEl, minEl }
		})

	const togglePathEdit = (val?: boolean): void => {
		adventureDispatch({ type: 'togglePathEdit', ...(val !== undefined && { payload: val }) })
	}

	const toggleMatchPath = (val?: boolean): void => {
		adventureDispatch({ type: 'toggleMatchPath', ...(val !== undefined && { payload: val }) })
	}

	const createNewDefaultAdventure = async ({
		lng,
		lat
	}: {
		lng: number
		lat: number
	}): Promise<AdventureType> => {
		const newDefaultAdventure: DefaultAdventure = {
			adventure_name: 'New Adventure',
			adventure_type: globalAdventureType as AdventureChoiceType,
			public: true,
			nearest_city: 'New City',
			coordinates: { lng, lat }
		}

		if (globalAdventureType !== null && ['ski', 'hike', 'bike'].includes(globalAdventureType)) {
			newDefaultAdventure.difficulty = '0:0'
		}

		try {
			const { data } = await fetcher(adventuresApi.create.url, {
				method: adventuresApi.create.method,
				body: newDefaultAdventure
			})

			const { adventure, all_adventures } = data
			adventureDispatch({
				type: 'addNewAdventure',
				payload: {
					adventures: all_adventures,
					currentAdventure: adventure
				}
			})

			return adventure
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not create a new adventure' })
			return {} as AdventureType
		}
	}

	const insertBulkAdventures = async ({
		adventuresObject
	}: {
		adventuresObject: AdventureType[]
	}): Promise<void> => {
		try {
			fetcher(adventuresApi.builkImport.url, {
				method: adventuresApi.builkImport.method,
				body: { adventures: adventuresObject }
			})
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not create bulk adventrues' })
			throw error
		}
	}

	const removeAdventureFromArea = async ({
		parentId,
		childId
	}: {
		parentId: number
		childId: number
	}): Promise<void> => {
		try {
			await fetcher(zonesApi.removeChild.url, {
				method: zonesApi.removeChild.method,
				body: {
					child_type: 'adventure',
					parent_zone_id: parentId,
					adventure_id: childId
				}
			})
		} catch (error) {
			console.log('removing adventure treewells')
			console.log(error)
		}
	}

	const removeAreaFromArea = async ({
		parentId,
		childId
	}: {
		parentId: number
		childId: number
	}): Promise<void> => {
		try {
			await fetcher(zonesApi.removeChild.url, {
				method: zonesApi.removeChild.method,
				body: {
					child_type: 'zone',
					parent_zone_id: parentId,
					child_zone_id: childId
				}
			})
		} catch (error) {
			console.log('removing adventure treewells')
			console.log(error)
		}
	}

	const setAdventureError = (adventureError: string): void => {
		adventureDispatch({ type: 'setAdventureError', payload: adventureError })
	}

	return {
		editAdventure,
		editCoordinates,
		createNewDefaultAdventure,
		insertBulkAdventures,
		setAdventureError,
		togglePathEdit,
		savePath,
		deletePath,
		updatePath,
		toggleAdventureAddState,
		toggleMatchPath,
		removeAdventureFromArea,
		removeAreaFromArea,
		toggleZoneAdd
	}
}

export const useDeleteAdventure = (): {
	deleteAdventure: ({
		adventureId,
		adventureType,
		adventureName
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		adventureName: string
	}) => Promise<void>
	toggleDeletePage: () => void
} => {
	const { getAllAdventures } = useGetAdventures()
	const { adventureDispatch, globalAdventureType } = useAdventureStateContext()
	const { cardDispatch } = useCardStateContext()

	const deleteAdventure = async ({
		adventureId,
		adventureType,
		adventureName
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		adventureName: string
	}): Promise<void> => {
		try {
			adventureDispatch({ type: 'deleteAdventure' })
			cardDispatch({
				type: 'openAlert',
				payload: `${adventureName} has been deleted.`
			})

			await fetcher(
				`${adventuresApi.deleteAdventure.url}?adventure_id=${adventureId}&adventure_type=${adventureType}`,
				{ method: adventuresApi.deleteAdventure.method }
			)
			await getAllAdventures({ type: globalAdventureType as AdventureChoiceType })
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not delete adventure' })
			throw error
		}
	}

	const toggleDeletePage = (): void => {
		adventureDispatch({ type: 'toggleIsDeletePageOpen' })
	}

	return { deleteAdventure, toggleDeletePage }
}
