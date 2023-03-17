import { useRef } from 'react'
import { SundayPeakServerUrls } from './config'

type HeaderType = {
	name: string
	value: string
}

type OptionsType = {
	body?: any
	headers?: HeaderType[]
	method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS'
}

const BEST_DELAY = 700

export const useDebounce = (
	callback: (...calbackargs: any[]) => any,
	delay: number = BEST_DELAY
) => {
	// timeout won't change with component reloads
	const timeout = useRef<NodeJS.Timeout>()

	return (...args: any) => {
		clearTimeout(timeout.current)

		timeout.current = setTimeout(() => {
			callback.apply(null, args)
		}, delay)
	}
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

export const fetcher = (url: string, options?: OptionsType) => {
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

	const request = new Request(`${SundayPeakServerUrls.serverUrl}${url}`, {
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
