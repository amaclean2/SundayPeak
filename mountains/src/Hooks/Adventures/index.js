import { useNavigate } from 'react-router-dom'

import getContent from 'TextContent'

import { useAdventureStateContext } from 'Hooks/Providers/adventureStateProvider'
import { useCardStateContext } from 'Hooks/Providers/cardStateProvider'
import { fetcher, useDebounce } from 'Hooks/Providers/utils'

export const useGetAdventure = () => {
	const { adventureDispatch } = useAdventureStateContext()
	const { cardDispatch } = useCardStateContext()

	const getAdventure = async ({ id, type }) => {
		if (!id || !type) throw new Error('id and type fields are required')

		return fetcher(`/adventures/details?id=${id}&type=${type}`)
			.then(({ data: { adventure } }) => {
				adventureDispatch({ type: 'currentAdventure', payload: adventure })
				return adventure
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
	const { adventureDispatch, adventureTypeViewer } = useAdventureStateContext()
	const navigate = useNavigate()

	const changeAdventureType = ({ type }) => {
		adventureDispatch({ type: 'adventureTypeViewer', payload: type })
		getAllAdventures({ type })
	}

	const createNewDefaultAdventure = ({ longitude, latitude }) => {
		const newDefaultAdventure = {
			adventure_name: 'New Adventure',
			adventure_type: adventureTypeViewer,
			public: true,
			nearest_city: 'New City',
			coordinates: {
				lng: longitude,
				lat: latitude
			}
		}

		return fetcher('/adventures/create', {
			method: 'POST',
			body: newDefaultAdventure
		})
			.then(({ data }) => data)
			.catch(console.error)
	}

	const insertBulkAdventures = ({ adventuresObject }) => {
		return fetcher('/adventures/bulkImport', {
			method: 'POST',
			body: { adventures: adventuresObject }
		})
			.then(() => navigate('/discover'))
			.catch(console.error)
	}

	const getAllAdventures = ({ type }) => {
		return fetcher(`/adventures/all?type=${type || adventureTypeViewer}`)
			.then(({ data: { adventures } }) => {
				adventureDispatch({
					type: 'allAdventures',
					payload: { adventures }
				})

				return adventures
			})
			.catch(console.error)
	}

	const searchAdventures = ({ searchQuery }) => {
		return fetcher(`/adventures/search?search=${searchQuery}`)
			.then(({ data }) => data.adventures)
			.catch(console.error)
	}

	const processCsvAdventures = ({ csvString }) => {
		return fetcher('/adventures/processCsv', {
			method: 'POST',
			body: { csvString }
		})
			.then(({ data }) => data.adventures)
			.catch(console.error)
	}

	return {
		getAllAdventures,
		searchAdventures,
		changeAdventureType,
		createNewDefaultAdventure,
		processCsvAdventures,
		insertBulkAdventures
	}
}

export const useSaveAdventure = () => {
	const { adventureDispatch, currentAdventure } = useAdventureStateContext()

	const saveEditAdventure = useDebounce(({ name, value }) => {
		return fetcher('/adventures/edit', {
			method: 'PUT',
			body: {
				field: {
					name,
					value,
					adventure_id: currentAdventure.id,
					adventure_type: currentAdventure.adventure_type
				}
			}
		})
	})

	const editAdventure = (event) => {
		adventureDispatch({
			type: 'editAdventure',
			payload: { ...currentAdventure, [event.target.name]: event.target.value }
		})
		return saveEditAdventure({ name: event.target.name, value: event.target.value })
	}

	return {
		editAdventure
	}
}

export const useDeleteAdventure = () => {
	const { getAllAdventures } = useGetAdventures()
	const { adventureDispatch, adventureTypeViewer } = useAdventureStateContext()
	const navigate = useNavigate()

	const deleteAdventure = ({ adventureId, adventureType }) => {
		return fetcher(
			`/adventures/delete?adventure_id=${adventureId}&adventure_type=${adventureType}`,
			{ method: 'DELETE' }
		)
			.then(() => {
				getAllAdventures({ type: adventureTypeViewer }).then(() => {
					adventureDispatch({ type: 'deleteAdventure' })
					navigate('/discover')
				})
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
