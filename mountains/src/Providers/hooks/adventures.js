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
	const { setAllAdventures, setStartPosition, currentBoundingBox, startPosition } =
		useAdventureEditContext()

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

	const refetchAdventures = debounce(100, ({ newStartPosition, boundingBox }) => {
		if (!boundingBox) {
			boundingBox = currentBoundingBox
		}

		if (!newStartPosition) {
			newStartPosition = startPosition
		}

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
				setAllAdventures(adventures)
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
		editAdventureFields,
		setEditAdventureFields,
		setAdventureError,
		setIsEditable,
		setCurrentAdventure
	} = useAdventureEditContext()

	const { closeCard } = useCardStateContext()

	const saveNewAdventure = () => {
		return fetcher(`/adventures/create`, {
			method: 'POST',
			body: {
				...currentAdventure,
				adventure_type: 'line'
			}
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
			const validatedEditFields = validateAdventure(editAdventureFields)
			setCurrentAdventure(validatedAdventure)
			setEditAdventureFields(validatedEditFields)
			setIsEditable(false)

			return validatedAdventure
		} catch (error) {
			console.error(error)
			setAdventureError(error.toString().replace('Error: ', ''))
		}
	}

	const saveEditAdventure = () => {
		const fieldKeys = Object.keys(editAdventureFields)
		const formattedFields = fieldKeys.map((key) => ({
			name: key,
			value: editAdventureFields[key]
		}))
		return fetcher(`/adventures/edit`, {
			method: 'PUT',
			body: {
				fields: formattedFields,
				adventure_id: currentAdventure.id
			}
		})
			.then(console.log)
			.catch(({ error }) => {
				setAdventureError(error.message)
				setIsEditable(true)
				throw error.message
			})
	}

	return {
		saveNewAdventure,
		startAdventureSaveProcess,
		saveEditAdventure
	}
}

export const useDeleteAdventure = () => {
	const { closeCard } = useCardStateContext()
	const { refetchAdventures } = useGetAdventures()
	const { setIsDeletePage } = useAdventureEditContext()
	const deleteAdventure = ({ adventureId }) => {
		return fetcher(`/adventures/delete?adventure_id=${adventureId}`, { method: 'DELETE' })
			.then(() => {
				closeCard()
				setIsDeletePage(false)
				return refetchAdventures()
			})
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
