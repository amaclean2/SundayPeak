import { getBackendUri } from '../Constants'

export const validateAdventure = (currentAdventure, setAdventureError) => {
	const coordinates = JSON.stringify(currentAdventure.coordinates)
	let approachDistance = null
	let season = null
	let avgAngle = null
	let maxAngle = null
	let elevation = null
	let difficulty = null
	let gear = null
	let gain = null

	if (typeof currentAdventure.adventure_name !== 'string') {
		setAdventureError('Adventure Name must be a string')
		throw new Error('Adventure Name must be a string')
	}

	if (
		isNaN(parseInt(currentAdventure.approach_distance)) &&
		currentAdventure.approach_distance !== ''
	) {
		setAdventureError('Appraoch Distance must contain a number')
		throw new Error('Approach Distance must contain a number')
	} else {
		approachDistance = parseInt(currentAdventure.approach_distance)
	}

	if (currentAdventure.season?.length) {
		season = JSON.stringify(currentAdventure.season.sort((a, b) => Number(a) - Number(b)))
	} else if (!currentAdventure.season) {
		season = JSON.stringify([])
	}

	if (isNaN(parseInt(currentAdventure.avg_angle)) && currentAdventure.avg_angle !== '') {
		setAdventureError('Average Angle must contain a number')
		throw new Error('Average angle must contain a number')
	} else {
		avgAngle = parseInt(currentAdventure.avg_angle)
	}

	if (isNaN(parseInt(currentAdventure.max_angle)) && currentAdventure.max_angle !== '') {
		setAdventureError('Max Angle must contain a number')
		throw new Error('Max angle must contain a number')
	} else {
		maxAngle = parseInt(currentAdventure.max_angle)
	}

	if (isNaN(parseInt(currentAdventure.elevation)) && currentAdventure.elevation !== '') {
		setAdventureError('Elevation must contain a number')
		throw new Error('Elevation must contain a number')
	} else {
		elevation = parseInt(currentAdventure.elevation)
	}

	if (isNaN(parseInt(currentAdventure.difficulty)) && currentAdventure.difficulty !== '') {
		setAdventureError('Difficulty must contain a number')
		throw new Error('Difficulty must contain a number')
	} else {
		difficulty = parseInt(currentAdventure.difficulty)
	}

	if (currentAdventure.gear?.length) {
		gear = JSON.stringify(currentAdventure.gear.sort((a, b) => Number(a) - Number(b)))
	} else if (!currentAdventure.gear.length) {
		gear = JSON.stringify([])
	}

	if (isNaN(parseInt(currentAdventure.gain)) && currentAdventure.gain !== '') {
		setAdventureError('Elevation Gain must contain a number')
		throw new Error('Elevation Gain must contian a number')
	} else {
		gain = parseInt(currentAdventure.gain)
	}

	const adventureObj = {
		adventure_type: 'line',
		adventure_name: currentAdventure.adventure_name,
		approach_distance: approachDistance,
		season,
		avg_angle: avgAngle,
		max_angle: maxAngle,
		elevation,
		difficulty,
		gear,
		gain,
		bio: currentAdventure.bio || '',
		nearest_city: currentAdventure.nearest_city || null,
		coordinates
	}

	return adventureObj
}

export const validateUser = (newUser, setUserError) => {}

export const fetcher = (url, options) => {
	const uri = getBackendUri()
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
			if (data.status - 200 >= 100) {
				throw data
			}

			return data
		})
}
