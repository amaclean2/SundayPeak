import { BACKEND_URI } from '../Constants'

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

export const validateAdventure = (currentAdventure, setAdventureError) => {
	if (!isDefined(setAdventureError)) {
		setAdventureError = () => {}
	}

	let approachDistance = null
	let season = null
	let avgAngle = null
	let maxAngle = null
	let elevation = null
	let gear = null
	let gain = null

	if (isDefined(currentAdventure.adventure_name)) {
		if (typeof currentAdventure.adventure_name !== 'string') {
			setAdventureError('Adventure Name must be a string')
			throw new Error('Adventure Name must be a string')
		}
	}

	if (isDefined(currentAdventure.approach_distance)) {
		if (
			isNaN(parseFloat(currentAdventure.approach_distance)) &&
			currentAdventure.approach_distance !== ''
		) {
			setAdventureError('Appraoch Distance must contain a number')
			throw new Error('Approach Distance must contain a number')
		} else {
			approachDistance = parseFloat(currentAdventure.approach_distance)
		}
	}

	if (isDefined(currentAdventure.season)) {
		if (currentAdventure.season?.length) {
			season = JSON.stringify(currentAdventure.season.sort((a, b) => Number(a) - Number(b)))
		} else if (!currentAdventure.season) {
			season = JSON.stringify([])
		}
	}

	if (isDefined(currentAdventure.avg_angle)) {
		if (isNaN(parseFloat(currentAdventure.avg_angle)) && currentAdventure.avg_angle !== '') {
			setAdventureError('Average Angle must contain a number')
			throw new Error('Average angle must contain a number')
		} else {
			avgAngle = parseFloat(currentAdventure.avg_angle)
		}
	}

	if (isDefined(currentAdventure.max_angle)) {
		if (
			currentAdventure.max_angle &&
			isNaN(parseFloat(currentAdventure.max_angle)) &&
			currentAdventure.max_angle !== ''
		) {
			setAdventureError('Max Angle must contain a number')
			throw new Error('Max angle must contain a number')
		} else {
			maxAngle = parseFloat(currentAdventure.max_angle)
		}
	}

	if (isDefined(currentAdventure.elevation)) {
		if (isNaN(parseFloat(currentAdventure.elevation)) && currentAdventure.elevation !== '') {
			setAdventureError('Elevation must contain a number')
			throw new Error('Elevation must contain a number')
		} else {
			elevation = parseFloat(currentAdventure.elevation)
		}
	}

	if (isDefined(currentAdventure.gear)) {
		if (currentAdventure.gear?.length) {
			gear = JSON.stringify(currentAdventure.gear.sort((a, b) => Number(a) - Number(b)))
		} else if (!currentAdventure.gear.length) {
			gear = JSON.stringify([])
		}
	}

	if (isDefined(currentAdventure.gain)) {
		if (isNaN(parseFloat(currentAdventure.gain)) && currentAdventure.gain !== '') {
			setAdventureError('Elevation Gain must contain a number')
			throw new Error('Elevation Gain must contian a number')
		} else {
			gain = parseFloat(currentAdventure.gain)
		}
	}

	return {
		...currentAdventure,
		...(currentAdventure.difficulty && { difficulty: parseFloat(currentAdventure.difficulty) }),
		...(currentAdventure.approach_distance && { approach_distance: approachDistance }),
		...(currentAdventure.season && { season: season || [] }),
		...(currentAdventure.avg_angle && { avg_angle: avgAngle }),
		...(currentAdventure.max_angle && { max_angle: maxAngle }),
		...(currentAdventure.elevation && { elevation }),
		...(currentAdventure.gear && { gear: gear || [] }),
		...(currentAdventure.gain && { gain }),
		...(currentAdventure.bio && { bio: currentAdventure.bio || '' }),
		...(currentAdventure.nearest_city && { nearest_city: currentAdventure.nearest_city || '' }),
		...(currentAdventure.coordinates && {
			coordinates: JSON.stringify(currentAdventure.coordinates)
		})
	}
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
