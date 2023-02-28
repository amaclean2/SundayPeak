import { debounce } from 'throttle-debounce'
import getContent from 'TextContent'

import { useAdventureStateContext } from 'Providers/adventureStateProvider'
import { useCardStateContext } from 'Providers/cardStateProvider'
import { fetcher, useAdventureValidation } from 'Providers/utils'
import { useEffect, useRef } from 'react'

export const useGetAdventure = () => {
	const { adventureDispatch } = useAdventureStateContext()
	const { cardDispatch } = useCardStateContext()

	const getAdventure = async ({ id }) => {
		return fetcher(`/adventures/details?id=${id}`)
			.then(({ data }) => {
				adventureDispatch({ type: 'currentAdventure', payload: data.adventure })
				return data
			})
			.catch(console.error)
	}

	const shareAdventure = ({ id }) => {
		const url = window.location.href
		const domain = url.includes('/adventure')
			? url.split('/adventure')[0]
			: url.split('/discover')[0]

		const newDomain = `${domain}/adventure/${id}`
		navigator.clipboard.writeText(newDomain)
		cardDispatch({ type: 'openAlert', payload: getContent('adventurePanel.linkCopied') })
	}

	return {
		getAdventure,
		shareAdventure
	}
}

export const useGetAdventures = () => {
	const { currentBoundingBox, startPosition, adventureDispatch, adventureTypeViewer } =
		useAdventureStateContext()
	const { screenType, cardDispatch } = useCardStateContext()
	const boundingRef = useRef(currentBoundingBox)

	useEffect(() => {
		boundingRef.current = currentBoundingBox
	}, [currentBoundingBox])

	const changeAdventureType = (newType) => {
		adventureDispatch({ type: 'adventureTypeViewer', payload: newType })
		refetchAdventures({ boundingBox: boundingRef.current })

		if (screenType.mobile) {
			cardDispatch({ type: 'closeCard' })
		}
	}

	const createNewDefaultAdventure = ({ longitude, latitude }) => ({
		id: 'waiting',
		adventure_name: '',
		adventure_type: adventureTypeViewer,
		images: [],
		public: true,
		coordinates: {
			lng: longitude,
			lat: latitude
		}
	})

	const getAllAdventures = async (boundingBox) => {
		return fetcher('/adventures/all', {
			method: 'POST',
			body: {
				bounding_box: {
					NE: boundingBox._ne,
					SW: boundingBox._sw
				},
				type: adventureTypeViewer
			}
		})
			.then(({ data: { adventures } }) => {
				adventureDispatch({
					type: 'allAdventures',
					payload: { adventures, startPosition, boundingBox }
				})

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
				type: localStorage.getItem('adventureTypeViewer')
			}
		})
			.then(({ data: { adventures } }) => {
				adventureDispatch({
					type: 'allAdventures',
					payload: { adventures, startPosition: newStartPosition, boundingBox }
				})

				return adventures
			})
			.catch(console.error)
	})

	const searchAdventures = ({ searchQuery }) => {
		return fetcher(`/adventures/search?queryString=${searchQuery}`)
			.then(({ data }) => data.adventures)
			.catch(console.error)
	}

	return {
		getAllAdventures,
		refetchAdventures,
		searchAdventures,
		changeAdventureType,
		createNewDefaultAdventure
	}
}

export const useSaveAdventure = () => {
	const { adventureDispatch, currentAdventure, editAdventureFields } = useAdventureStateContext()
	const validateAdventure = useAdventureValidation()

	const { cardDispatch } = useCardStateContext()

	const saveNewAdventure = () => {
		return fetcher(`/adventures/create`, {
			method: 'POST',
			body: currentAdventure
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
	const { adventureDispatch, currentBoundingBox } = useAdventureStateContext()
	const boundingRef = useRef(currentBoundingBox)

	useEffect(() => {
		boundingRef.current = currentBoundingBox
	}, [currentBoundingBox])

	const deleteAdventure = ({ adventureId }) => {
		return fetcher(`/adventures/delete?adventure_id=${adventureId}`, { method: 'DELETE' })
			.then(() => {
				cardDispatch({ type: 'closeCard' })
				adventureDispatch({ type: 'deleteAdventure' })
				return refetchAdventures({ boundingBox: boundingRef.current })
			})
			.catch(console.error)
	}

	return deleteAdventure
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

	return submitAdventurePicture
}
