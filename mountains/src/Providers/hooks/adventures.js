import { debounce } from 'throttle-debounce'

import { useAdventureStateContext } from '../adventureStateProvider'
import { useCardStateContext } from '../cardStateProvider'
import { fetcher, useAdventureValidation } from '../utils'

export const useGetAdventure = () => {
	const { adventureDispatch } = useAdventureStateContext()

	const getAdventure = async ({ id }) => {
		return fetcher(`/adventures/details?id=${id}`)
			.then(({ data }) => {
				adventureDispatch({ type: 'currentAdventure', payload: data.adventure })
				return data
			})
			.catch(console.error)
	}

	return getAdventure
}

export const useGetAdventures = () => {
	const { currentBoundingBox, startPosition, adventureDispatch } = useAdventureStateContext()

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
				adventureDispatch({ type: 'allAdventures', payload: { adventures, startPosition } })

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
				adventureDispatch({
					type: 'allAdventures',
					payload: { adventures, startPosition: newStartPosition }
				})

				return adventures
			})
			.catch(console.error)
	})

	return { getAllAdventures, refetchAdventures }
}

export const useSaveAdventure = () => {
	const { adventureDispatch, allAdventures, currentAdventure, editAdventureFields } =
		useAdventureStateContext()
	const validateAdventure = useAdventureValidation()

	const { cardDispatch } = useCardStateContext()

	const saveNewAdventure = () => {
		return fetcher(`/adventures/create`, {
			method: 'POST',
			body: {
				...currentAdventure,
				adventure_type: 'line'
			}
		})
			.then(({ data }) => {
				adventureDispatch({
					type: 'addNewAdventure',
					payload: data.adventure
				})

				cardDispatch({ type: 'closeCard' })
			})
			.catch((error) => {
				console.error(error)
				adventureDispatch({
					type: 'adventureError',
					payload: error.toString().replace('Error: ', '')
				})

				return error
			})
	}

	const startAdventureSaveProcess = () => {
		try {
			const validatedAdventure = validateAdventure({ fields: currentAdventure })
			const validatedEditFields = validateAdventure({
				fields: editAdventureFields,
				type: 'editFields'
			})
			adventureDispatch({
				type: 'validateAdventure',
				payload: { currentAdventure: validatedAdventure, editAdventureFields: validatedEditFields }
			})
			adventureDispatch({ type: 'toggleAdventureEditable' })

			return validatedAdventure
		} catch (error) {
			console.error(error)
			adventureDispatch({
				type: 'adventureError',
				payload: error.toString().replace('Error: ', '')
			})
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
				adventureDispatch({ type: 'adventureErrorOnSave', payload: error.message })
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
	const { cardDispatch } = useCardStateContext()
	const { refetchAdventures } = useGetAdventures()
	const { adventureDispatch } = useAdventureStateContext()
	const deleteAdventure = ({ adventureId }) => {
		return fetcher(`/adventures/delete?adventure_id=${adventureId}`, { method: 'DELETE' })
			.then(() => {
				cardDispatch({ type: 'closeCard' })
				adventureDispatch({ type: 'toggleDeletePage' })
				return refetchAdventures()
			})
			.catch(console.error)
	}

	return deleteAdventure
}

export const useSubmitAdventurePicture = () => {
	const getAdventure = useGetAdventure()

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

	return submitAdventurePicture
}
