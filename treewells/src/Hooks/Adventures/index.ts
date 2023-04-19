import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import type { AdventureChoiceType, AdventureList, AdventureType } from '../../Types/Adventures'
import { fetcher, useDebounce } from '../../utils'
import { adventures } from '../Apis'
import type { EventChoiceTypes } from '../Users'

export const useGetAdventures = (): {
	getAdventure: ({ id, type }: { id: number; type: AdventureChoiceType }) => Promise<AdventureType>
	getAllAdventures: ({ type }: { type: AdventureChoiceType }) => Promise<AdventureList>
	searchAdventures: ({ searchQuery }: { searchQuery: string }) => Promise<any>
	changeAdventureType: ({ type }: { type: AdventureChoiceType }) => void
	processCsvAdventures: ({ csvString }: { csvString: string }) => Promise<AdventureType[]>
} => {
	const { adventureDispatch, globalAdventureType } = useAdventureStateContext()

	const getAdventure = async ({
		id,
		type
	}: {
		id: number
		type: AdventureChoiceType
	}): Promise<AdventureType> => {
		if (id === undefined || type === undefined) throw new Error('id and type fields are required')

		const {
			data: { adventure }
		} = await fetcher(`${adventures.getAdventureDetails.url}?id=${id}&type=${type}`, {
			method: adventures.getAdventureDetails.method
		})

		adventureDispatch({ type: 'setCurrentAdventure', payload: adventure })
		return adventure
	}

	// const shareAdventure = ({ id }: { id: number }) => {
	// 	const url = window.location.href
	// 	const domain = url.includes('/adventure')
	// 		? url.split('/adventure')[0]
	// 		: url.split('/discover')[0]

	// 	const newDomain = `${domain}/adventure/${id}`
	// 	navigator.clipboard.writeText(newDomain)
	// 	cardDispatch({ type: 'openAlert', payload: 'Your adventure has been copied to the clipboard' })
	// }

	const changeAdventureType = ({ type }: { type: AdventureChoiceType }): void => {
		adventureDispatch({ type: 'startNewAdventureProcess', payload: type })
		// I'm replacing getAllAdventures here with a watcher in adventureStateContext
		// that calls getAllAdventures anytime the globalAdventureState changes
	}

	const getAllAdventures = async ({
		type
	}: {
		type: AdventureChoiceType
	}): Promise<AdventureList> => {
		const {
			data: { adventures: responseAdventures }
		} = await fetcher(`${adventures.getAllAdventures.url}?type=${type ?? globalAdventureType}`, {
			method: adventures.getAllAdventures.method
		})

		adventureDispatch({ type: 'setAllAdventures', payload: responseAdventures })

		return responseAdventures
	}

	const searchAdventures = async ({
		searchQuery
	}: {
		searchQuery: string
	}): Promise<AdventureType[]> => {
		const { data } = await fetcher(`${adventures.searchForAdventures.url}?search=${searchQuery}`, {
			method: adventures.searchForAdventures.method
		})

		return data.adventures
	}

	const processCsvAdventures = async ({
		csvString
	}: {
		csvString: string
	}): Promise<AdventureType[]> => {
		const { data } = await fetcher(adventures.processAdventureCSV.url, {
			method: adventures.processAdventureCSV.method,
			body: { csvString }
		})

		return data.adventures
	}

	return {
		getAdventure,
		getAllAdventures,
		searchAdventures,
		changeAdventureType,
		processCsvAdventures
	}
}

export const useSaveAdventure = (): {
	editAdventure: (event: EventChoiceTypes) => void
	createNewDefaultAdventure: ({
		longitude,
		latitude
	}: {
		longitude: number
		latitude: number
	}) => Promise<AdventureType>
	insertBulkAdventures: ({
		adventuresObject
	}: {
		adventuresObject: AdventureType[]
	}) => Promise<void>
} => {
	const { adventureDispatch, currentAdventure, globalAdventureType } = useAdventureStateContext()

	const saveEditAdventure = useDebounce(
		({ name, value }: { name: string; value: string | number }): void => {
			fetcher(adventures.editAdventure.url, {
				method: adventures.editAdventure.method,
				body: {
					field: {
						name,
						value,
						adventure_id: currentAdventure?.id,
						adventure_type: currentAdventure?.adventure_type
					}
				}
			})
		}
	)

	const editAdventure = (event: EventChoiceTypes): void => {
		saveEditAdventure({ name: event.target.name, value: event.target.value })
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: event.target.name,
				value: event.target.value
			}
		})
	}

	const createNewDefaultAdventure = async ({
		longitude,
		latitude
	}: {
		longitude: number
		latitude: number
	}): Promise<AdventureType> => {
		const newDefaultAdventure = {
			adventure_name: 'New Adventure',
			adventure_type: globalAdventureType,
			public: true,
			nearest_city: 'New City',
			coordinates: {
				lng: longitude,
				lat: latitude
			}
		}

		try {
			const { data } = await fetcher(adventures.create.url, {
				method: adventures.create.method,
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
			console.error(error)
			return {} as AdventureType
		}
	}

	const insertBulkAdventures = async ({
		adventuresObject
	}: {
		adventuresObject: AdventureType[]
	}): Promise<void> => {
		try {
			fetcher(adventures.builkImport.url, {
				method: adventures.builkImport.method,
				body: { adventures: adventuresObject }
			})
		} catch (error) {
			console.error(error)
		}
	}

	return {
		editAdventure,
		createNewDefaultAdventure,
		insertBulkAdventures
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
		cardDispatch({
			type: 'openAlert',
			payload: `${adventureName} has been deleted.`
		})
		await fetcher(
			`${adventures.deleteAdventure.url}?adventure_id=${adventureId}&adventure_type=${adventureType}`,
			{ method: adventures.deleteAdventure.method }
		)

		await getAllAdventures({ type: globalAdventureType })
		adventureDispatch({ type: 'deleteAdventure' })
	}

	const toggleDeletePage = (): void => {
		adventureDispatch({ type: 'switchIsDeletePageOpen' })
	}

	return { deleteAdventure, toggleDeletePage }
}

export const useSubmitAdventurePicture = (): { submitAdventurePicture: () => void } => {
	const submitAdventurePicture = (): void => {}

	return {
		submitAdventurePicture
	}
}
