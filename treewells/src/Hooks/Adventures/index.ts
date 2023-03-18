import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import { AdventureChoiceType, AdventureType } from '../../Types/Adventures'
import { fetcher, useDebounce } from '../../utils'
import { adventures } from '../Apis'
import { EventChoiceTypes } from '../Users'

export const useGetAdventures = () => {
	const { adventureDispatch, globalAdventureType } = useAdventureStateContext()

	const getAdventure = async ({ id, type }: { id: number; type: AdventureChoiceType }) => {
		if (!id || !type) throw new Error('id and type fields are required')

		return fetcher(`${adventures.getAdventureDetails.url}?id=${id}&type=${type}`, {
			method: adventures.getAdventureDetails.method
		})
			.then(({ data: { adventure } }) => {
				adventureDispatch({ type: 'setCurrentAdventure', payload: adventure })
				return adventure
			})
			.catch(console.error)
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

	const changeAdventureType = ({ type }: { type: AdventureChoiceType }) => {
		adventureDispatch({ type: 'startNewAdventureProcess', payload: type })
		getAllAdventures({ type })
	}

	const getAllAdventures = ({ type }: { type: AdventureChoiceType }) => {
		return fetcher(`${adventures.getAllAdventures.url}?type=${type || globalAdventureType}`, {
			method: adventures.getAllAdventures.method
		})
			.then(({ data: { adventures } }) => {
				adventureDispatch({ type: 'setAllAdventures', payload: { adventures } })
				return adventures
			})
			.catch(console.error)
	}

	const searchAdventures = ({ searchQuery }: { searchQuery: string }) => {
		return fetcher(`${adventures.searchForAdventures.url}?search=${searchQuery}`, {
			method: adventures.searchForAdventures.method
		})
			.then(({ data }) => data.adventures)
			.catch(console.error)
	}

	const processCsvAdventures = ({ csvString }: { csvString: string }) => {
		return fetcher(adventures.processAdventureCSV.url, {
			method: adventures.processAdventureCSV.method,
			body: { csvString }
		})
			.then(({ data }) => data.adventures)
			.catch(console.error)
	}

	return {
		getAdventure,
		getAllAdventures,
		searchAdventures,
		changeAdventureType,
		processCsvAdventures
	}
}

export const useSaveAdventure = () => {
	const { adventureDispatch, currentAdventure, globalAdventureType } = useAdventureStateContext()

	const saveEditAdventure = useDebounce(({ name, value }) => {
		return fetcher(adventures.editAdventure.url, {
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
	})

	const editAdventure = (event: EventChoiceTypes) => {
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: event.target.name,
				value: event.target.value
			}
		})
		return saveEditAdventure({ name: event.target.name, value: event.target.value })
	}

	const createNewDefaultAdventure = ({
		longitude,
		latitude
	}: {
		longitude: number
		latitude: number
	}) => {
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

		return fetcher(adventures.create.url, {
			method: adventures.create.method,
			body: newDefaultAdventure
		})
			.then(({ data }) => {
				const { adventure, all_adventures } = data
				adventureDispatch({
					type: 'addNewAdventure',
					payload: {
						adventures: all_adventures,
						currentAdventure: adventure
					}
				})
				return adventure
			})
			.catch(console.error)
	}

	const insertBulkAdventures = ({ adventuresObject }: { adventuresObject: AdventureType[] }) => {
		return fetcher(adventures.builkImport.url, {
			method: adventures.builkImport.method,
			body: { adventures: adventuresObject }
		}).catch(console.error)
	}

	return {
		editAdventure,
		createNewDefaultAdventure,
		insertBulkAdventures
	}
}

export const useDeleteAdventure = () => {
	const { getAllAdventures } = useGetAdventures()
	const { adventureDispatch, globalAdventureType } = useAdventureStateContext()
	const { cardDispatch } = useCardStateContext()

	const deleteAdventure = ({
		adventureId,
		adventureType,
		adventureName
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		adventureName: string
	}) => {
		cardDispatch({
			type: 'openAlert',
			payload: `${adventureName} has been deleted.`
		})
		return fetcher(
			`${adventures.deleteAdventure.url}?adventure_id=${adventureId}&adventure_type=${adventureType}`,
			{ method: adventures.deleteAdventure.method }
		)
			.then(() => {
				getAllAdventures({ type: globalAdventureType }).then(() =>
					adventureDispatch({ type: 'deleteAdventure' })
				)
			})
			.catch(console.error)
	}

	const toggleDeletePage = () => {
		adventureDispatch({ type: 'switchIsDeletePageOpen' })
	}

	return { deleteAdventure, toggleDeletePage }
}

export const useSubmitAdventurePicture = () => {
	const submitAdventurePicture = () => {}

	return submitAdventurePicture
}
