import type { Dispatch } from 'react'

type URLSuffixs = '.com' | '.net' | '.co.uk' | '.org' | '.gov' | '.cz' | ''
export type URLType = `${'http://' | 'https://' | 'ws://'}${string}${URLSuffixs}`

type CloseMessage = {
	type: 'closeCardMessage'
	payload: string
}

type SetGalleryImage = {
	type: 'setGalleryImage'
	payload: URLType
}

type OpenAlert = {
	type: 'openAlert'
	payload: string
}

type CloseAlert = {
	type: 'closeAlert'
}

export type CardAction = CloseMessage | SetGalleryImage | OpenAlert | CloseAlert

export type CardState = {
	galleryImage: URLType | null
	showAlert: boolean
	alertContent: string
	screenType: {
		mobile: boolean
		tablet: boolean
		browser: boolean
	}
}

export type CardContext = CardState & { cardDispatch: Dispatch<CardAction> }
