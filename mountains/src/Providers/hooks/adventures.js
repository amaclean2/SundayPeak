import { debounce } from 'throttle-debounce'

import { useAdventureEditContext } from '../adventureEditProvider'
import { useCardStateContext } from '../cardStateProvider'
import { fetcher, validateAdventure } from '../utils'

export const useGetAdventure = () => {
	const { setCurrentAdventure } = useAdventureEditContext()

	const getAdventure = async ({ id }) => {
		return fetcher(`/adventures/details?id=${id}`)
			.then(({ data }) => {
				setCurrentAdventure(data.adventure)

				return data
			})
			.catch(console.error)
	}

	return { getAdventure }
}

export const useGetAdventures = () => {
	const { setAllAdventures, setStartPosition } = useAdventureEditContext()

	const getAllAdventures = async (boundingBox) => {
		return fetcher('/adventures/all', {
			method: 'POST',
			body: {
				bounding_box: {
					NE: boundingBox._ne,
					SW: boundingBox._sw
				},
				type: 'line'
			}
		})
			.then(({ data: { adventures } }) => {
				setAllAdventures((currAdventures) => [...currAdventures, ...adventures])

				return adventures
			})
			.catch(console.error)
	}

	const refetchAdventures = debounce(100, (newStartPosition, boundingBox) => {
		fetcher('/adventures/all', {
			method: 'POST',
			body: {
				bounding_box: {
					NE: boundingBox._ne,
					SW: boundingBox._sw
				},
				type: 'line'
			}
		})
			.then(({ data: { adventures } }) => {
				setAllAdventures((currAdventures) => {
					const currentIds = currAdventures.map(({ id }) => id)
					return [...currAdventures, ...adventures.filter(({ id }) => !currentIds.includes(id))]
				})
				setStartPosition(newStartPosition)

				return adventures
			})
			.catch(console.error)
	})

	return { getAllAdventures, refetchAdventures }
}

export const useSaveAdventure = () => {
	const {
		setAllAdventures,
		currentAdventure,
		setAdventureError,
		setIsEditable,
		setCurrentAdventure
	} = useAdventureEditContext()

	const { closeCard } = useCardStateContext()

	const saveNewAdventure = () => {
		return fetcher(`/adventures/create`, {
			method: 'POST',
			body: currentAdventure
		})
			.then(({ data }) => {
				setAllAdventures((currAdventures) => {
					currAdventures = currAdventures.filter(({ id }) => id !== 'waiting')

					return [...currAdventures, data.adventure]
				})

				closeCard()
			})
			.catch((error) => {
				console.error(error)
				setAdventureError(error.toString().replace('Error: ', ''))

				return error
			})
	}

	const startAdventureSaveProcess = () => {
		try {
			const validatedAdventure = validateAdventure(currentAdventure, setAdventureError)
			setCurrentAdventure(validatedAdventure)
			setIsEditable(false)

			return validatedAdventure
		} catch (error) {
			console.error(error)
			setAdventureError(error.toString().replace('Error: ', ''))
		}
	}

	return {
		saveNewAdventure,
		startAdventureSaveProcess
	}
}

export const useDeleteAdventure = () => {
	const { setAllAdventures } = useAdventureEditContext()

	const deleteAdventure = ({ adventureId }) => {
		return fetcher(`/adventures/delete?adventure_id=${adventureId}`, { method: 'DELETE' })
			.then(() => setAllAdventures([]))
			.catch(console.error)
	}

	return {
		deleteAdventure
	}
}

export const useSubmitAdventurePicture = () => {
	const { getAdventure } = useGetAdventure()

	const submitAdventurePicture = ({ data, adventureId }) => {
		const formData = new FormData()
		formData.append('image', data)

		return fetcher(`/pictures/adventureUpload?adventure_id=${adventureId}`, {
			method: 'POST',
			headers: [{ name: 'content-type', value: 'none' }],
			body: formData
		})
			.then(() => getAdventure({ id: adventureId }))
			.catch(console.error)
	}

	return { submitAdventurePicture }
}
