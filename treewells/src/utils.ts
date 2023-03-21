import { useRef } from 'react'

import { Connections, Storage } from './config'

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
): any => {
	// timeout won't change with component reloads
	const timeout = useRef<NodeJS.Timeout>()

	return (...args: any): void => {
		clearTimeout(timeout.current)

		timeout.current = setTimeout(() => {
			callback.apply(null, args)
		}, delay)
	}
}

type ScrenType = {
	mobile: boolean
	tablet: boolean
	browser: boolean
}

export const getScreenType = (): ScrenType => {
	const screenWidth = window?.screen?.width

	const screenType: ScrenType = {
		mobile: false,
		tablet: false,
		browser: false
	}

	if (screenWidth !== undefined && screenWidth < 420) {
		screenType.mobile = true
	} else if (screenWidth < 1300) {
		screenType.tablet = true
	} else {
		screenType.browser = true
	}

	return screenType
}

export const fetcher = async (url: string, options?: OptionsType): Promise<any> => {
	const token = (await Storage.getItem('token')) as string
	const headers = new Headers()

	let body = null

	options?.headers?.forEach((header) => {
		headers.append(header.name, header.value)
	})

	if (token !== undefined) {
		headers.append('authorization', `Bearer ${token}`)
	}

	if (headers.get('content-type') === null) {
		headers.append('content-type', 'application/json')
	}

	if (options?.body !== undefined && headers.get('content-type') === 'application/json') {
		body = JSON.stringify(options.body)
	} else if (headers.get('content-type') !== 'application/json' && options?.body !== undefined) {
		body = options.body
	}

	if (headers.get('content-type') === 'none') {
		headers.delete('content-type')
	}

	const request = new Request(`${Connections.restUrl}${url}`, {
		...(body !== undefined && { body }),
		headers,
		method: options?.method ?? 'GET'
	})

	const responseData = await (await fetch(request)).json()

	if (responseData.statusCode - 200 >= 100) {
		throw responseData
	} else {
		return responseData
	}
}
