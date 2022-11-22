import { BACKEND_URI } from '../Constants'
import { useAdventureStateContext } from './adventureStateProvider'

const isDefined = (property) => typeof property !== 'undefined'

export const createNewDefaultAdventure = ({ longitude, latitude }) => ({
	id: 'waiting',
	adventure_name: 'New Adventure',
	aspect: 'N',
	images: [],
	coordinates: {
		lng: longitude,
		lat: latitude
	}
})

export const useAdventureValidation = () => {
	const { adventureDispatch } = useAdventureStateContext()

	const validateAdventure = ({ fields, type }) => {
		const callDispatch = type === 'editFields' ? () => {} : adventureDispatch

		let approachDistance = null
		let season = null
		let avgAngle = null
		let maxAngle = null
		let elevation = null
		let gear = null
		let gain = null

		if (isDefined(fields.adventure_name)) {
			if (typeof fields.adventure_name !== 'string') {
				callDispatch({ type: 'adventureError', payload: 'Adventure Name must be a string' })
				throw new Error('Adventure Name must be a string')
			}
		}

		if (isDefined(fields.approach_distance)) {
			if (isNaN(parseFloat(fields.approach_distance)) && fields.approach_distance !== '') {
				callDispatch({ type: 'adventureError', payload: 'Appraoch Distance must contain a number' })
				throw new Error('Approach Distance must contain a number')
			} else {
				approachDistance = parseFloat(fields.approach_distance)
			}
		}

		if (isDefined(fields.season)) {
			if (fields.season?.length) {
				if (typeof fields.season === 'string') {
					fields.season = JSON.parse(fields.season)
				}

				season = JSON.stringify(fields.season.sort((a, b) => Number(a) - Number(b)))
			} else if (!fields.season) {
				season = JSON.stringify([])
			}
		}

		if (isDefined(fields.avg_angle)) {
			if (isNaN(parseFloat(fields.avg_angle)) && fields.avg_angle !== '') {
				callDispatch({ type: 'adventureError', payload: 'Average Angle must contain a number' })
				throw new Error('Average angle must contain a number')
			} else {
				avgAngle = parseFloat(fields.avg_angle)
			}
		}

		if (isDefined(fields.max_angle)) {
			if (fields.max_angle && isNaN(parseFloat(fields.max_angle)) && fields.max_angle !== '') {
				callDispatch({ type: 'adventureError', payload: 'Max Angle must contain a number' })
				throw new Error('Max angle must contain a number')
			} else {
				maxAngle = parseFloat(fields.max_angle)
			}
		}

		if (isDefined(fields.elevation)) {
			if (isNaN(parseFloat(fields.elevation)) && fields.elevation !== '') {
				callDispatch({ type: 'adventureError', payload: 'Elevation must contain a number' })
				throw new Error('Elevation must contain a number')
			} else {
				elevation = parseFloat(fields.elevation)
			}
		}

		if (isDefined(fields.gear)) {
			if (fields.gear?.length) {
				if (typeof fields.gear === 'string') {
					fields.gear = JSON.parse(fields.gear)
				}

				gear = JSON.stringify(fields.gear.sort((a, b) => Number(a) - Number(b)))
			} else if (!fields.gear.length) {
				gear = JSON.stringify([])
			}
		}

		if (isDefined(fields.gain)) {
			if (isNaN(parseFloat(fields.gain)) && fields.gain !== '') {
				callDispatch({ type: 'adventureError', payload: 'Elevation Gain must contain a number' })
				throw new Error('Elevation Gain must contian a number')
			} else {
				gain = parseFloat(fields.gain)
			}
		}

		return {
			...fields,
			...(fields.difficulty && { difficulty: parseFloat(fields.difficulty) }),
			...(fields.approach_distance && { approach_distance: approachDistance }),
			...(fields.season && { season: season || [] }),
			...(fields.avg_angle && { avg_angle: avgAngle }),
			...(fields.max_angle && { max_angle: maxAngle }),
			...(fields.elevation && { elevation }),
			...(fields.gear && { gear: gear || [] }),
			...(fields.gain && { gain }),
			...(fields.bio && { bio: fields.bio || '' }),
			...(fields.nearest_city && { nearest_city: fields.nearest_city || '' }),
			...(fields.coordinates && {
				coordinates: JSON.stringify(fields.coordinates)
			})
		}
	}

	return validateAdventure
}

export const validateUser = (newUser, setUserError) => {}

export const fetcher = (url, options) => {
	const uri = BACKEND_URI
	const token = localStorage.getItem('token')
	const headers = new Headers()

	let body = null

	options?.headers?.forEach((header) => {
		headers.append(header.name, header.value)
	})

	if (token) {
		headers.append('authorization', `Bearer ${token}`)
	}

	if (!headers.get('content-type')) {
		headers.append('content-type', 'application/json')
	}

	if (options?.body && headers.get('content-type') === 'application/json') {
		body = JSON.stringify(options.body)
	} else if (headers.get('content-type') !== 'application/json' && options?.body) {
		body = options.body
	}

	if (headers.get('content-type') === 'none') {
		headers.delete('content-type')
	}

	const request = new Request(`${uri}${url}`, {
		...(!!body && { body }),
		headers,
		method: options?.method || 'GET'
	})

	return fetch(request)
		.then((resp) => {
			if (resp.status !== 204) {
				return resp.json()
			} else {
				return resp
			}
		})
		.then((data) => {
			if (data.statusCode - 200 >= 100) {
				throw data
			}

			return data
		})
		.catch((error) => {
			throw error
		})
}

export const getScreenType = () => {
	const screenWidth = window.screen.width
	let screenType = {
		mobile: false,
		tablet: false,
		browser: false
	}

	if (screenWidth < 420) {
		screenType.mobile = true
	} else if (screenWidth < 1300) {
		screenType.tablet = true
	} else {
		screenType.browser = true
	}

	return screenType
}
