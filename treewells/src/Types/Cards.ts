import { Dispatch } from 'react'

type CloseMessage = {
	type: 'closeCardMessage'
	payload: string
}

type SetGalleryImage = {
	type: 'setGalleryImage'
	payload: string
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
	galleryImage: string | null
	showAlert: boolean
	alertContent: string
	screenType: {
		mobile: boolean
		tablet: boolean
		browser: boolean
	}
}

export type CardContext = CardState & { cardDispatch: Dispatch<CardAction> }
