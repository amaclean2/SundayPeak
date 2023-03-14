import { createContext, useContext, useReducer } from 'react'
import { getScreenType } from './utils'

const CardStateContext = createContext()

export const useCardStateContext = () => {
	const context = useContext(CardStateContext)

	if (context === undefined) {
		throw new Error('useCardStateContext must be used within a CardStateProvider')
	}

	return context
}

export const CARD_TYPES = {
	adventures: 'adenvetures',
	profile: 'profile',
	signup: 'signup',
	login: 'login',
	password_reset: 'password_reset',
	new_password: 'new_password',
	plan: 'plan',
	privacy: 'privacy'
}

export const CardStateProvider = ({ children }) => {
	const initialCardState = {
		displayCardBoolState: true,
		viewingImage: null,
		showAlert: false,
		alertContent: '',
		screenType: getScreenType()
	}

	const cardReducer = (state, action) => {
		switch (action.type) {
			case 'closeCardMessage':
				return {
					...state,
					displayCardBoolState: false,
					workingCard: '',
					showAlert: true,
					alertContent: action.payload
				}
			case 'viewingImage':
				return { ...state, viewingImage: action.payload }
			case 'openAlert':
				return { ...state, showAlert: true, alertContent: action.payload }
			case 'closeAlert':
				return { ...state, showAlert: false }
			default:
				return state
		}
	}

	const [cardState, cardDispatch] = useReducer(cardReducer, initialCardState)

	return (
		<CardStateContext.Provider
			value={{
				...cardState,
				cardDispatch
			}}
		>
			{children}
		</CardStateContext.Provider>
	)
}
