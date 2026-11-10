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
	if (window === undefined || window === null) {
		return {
			mobile: true,
			tablet: false,
			browser: false
		}
	}

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

export const showClimbGrades = (climbType: string): Array<{ label: string; value: string }> => {
	switch (climbType) {
		case 'boulder':
			return [
				{ label: 'V0', value: '0' },
				{ label: 'V1', value: '1' },
				{ label: 'V2', value: '2' },
				{ label: 'V3', value: '3' },
				{ label: 'V4', value: '4' },
				{ label: 'V5', value: '5' },
				{ label: 'V6', value: '6' },
				{ label: 'V7', value: '7' },
				{ label: 'V8', value: '8' },
				{ label: 'V9', value: '9' },
				{ label: 'V10', value: '10' },
				{ label: 'V11', value: '11' },
				{ label: 'V12', value: '12' },
				{ label: 'V13', value: '13' },
				{ label: 'V14', value: '14' },
				{ label: 'V15', value: '15' },
				{ label: 'V16', value: '16' }
			]
		case 'sport':
		case 'trad':
			return [
				{ label: '5.2', value: '0' },
				{ label: '5.3', value: '1' },
				{ label: '5.4', value: '2' },
				{ label: '5.5', value: '3' },
				{ label: '5.6', value: '4' },
				{ label: '5.7', value: '5' },
				{ label: '5.8', value: '6' },
				{ label: '5.9', value: '7' },
				{ label: '5.10a', value: '8' },
				{ label: '5.10b', value: '9' },
				{ label: '5.10c', value: '10' },
				{ label: '5.10d', value: '11' },
				{ label: '5.11a', value: '12' },
				{ label: '5.11b', value: '13' },
				{ label: '5.11c', value: '14' },
				{ label: '5.11d', value: '15' },
				{ label: '5.12a', value: '16' },
				{ label: '5.12b', value: '17' },
				{ label: '5.12c', value: '18' },
				{ label: '5.12d', value: '19' },
				{ label: '5.13a', value: '20' },
				{ label: '5.13b', value: '21' },
				{ label: '5.13c', value: '22' },
				{ label: '5.13d', value: '23' },
				{ label: '5.14a', value: '24' },
				{ label: '5.14b', value: '25' },
				{ label: '5.14c', value: '26' },
				{ label: '5.14d', value: '27' },
				{ label: '5.15a', value: '38' },
				{ label: '5.15b', value: '29' },
				{ label: '5.15c', value: '30' },
				{ label: '5.15d', value: '31' }
			]
		default:
			return [{ label: 'Something', value: 'something' }]
	}
}

export const gradeConverter = (grade: string, climbType: string): string | undefined => {
	return showClimbGrades(climbType).find(({ value }) => value === grade.split(':')[0])?.label
}

export const fetcher = async (
	url: string,
	options?: OptionsType,
	useDummyData?: Record<string, unknown>
): Promise<any> => {
	if (useDummyData !== undefined) {
		return { data: useDummyData }
	}

	const token = (await Storage.getItem('token')) as string
	const headers = new Headers()

	let body = null

	options?.headers?.forEach((header) => {
		headers.append(header.name, header.value)
	})

	const hasHeader = options?.headers?.some(({ name }) => name.toLowerCase() === 'authorization')

	if (Boolean(token) && hasHeader !== true) {
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

	const assembledUrl = url.includes('http') ? url : `${Connections.restUrl}${url}`

	const response = await fetch(assembledUrl, {
		...(body !== undefined && { body }),
		headers,
		method: options?.method ?? 'GET'
	})

	if (response === undefined) {
		throw new Error('no response found from request')
	}

	if (response?.status === 204) {
		return true
	}

	const responseData = await response.json()

	if (response.status - 200 >= 100) {
		throw responseData
	} else {
		return responseData
	}
}
