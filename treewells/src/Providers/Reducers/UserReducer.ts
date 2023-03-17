import { UserAction, UserState, UserType } from '../../Types/User'

export const initialUserState: UserState = {
	loginError: null,
	workingUser: {} as UserType,
	loggedInUser: {} as UserType,
	formFields: {},
	userEditState: false,
	statState: 'completed',
	searchList: null,
	images: []
}

export const userReducer = (state: UserState, action: UserAction): UserState => {
	switch (action.type) {
		case 'setWorkingUser':
			return { ...state, workingUser: action.payload }
		case 'setUserEditFields':
			return {
				...state,
				loggedInUser: {
					...state.loggedInUser,
					[action.payload.name]: action.payload.value
				},
				workingUser: {
					...state.workingUser,
					[action.payload.name]: action.payload.value
				},
				formFields: {
					...state.formFields,
					[action.payload.name]: action.payload.value
				}
			}
		case 'setLoggedInUser':
			return {
				...state,
				loggedInUser: action.payload,
				workingUser: action.payload,
				loginError: null,
				formFields: {}
			}
		case 'logout':
			localStorage.clear()
			return { ...state, loggedInUser: {} as UserType }
		case 'setFormFields':
			return { ...state, formFields: action.payload, loginError: null }
		case 'clearForm':
			return { ...state, loginError: null, formFields: {} }
		case 'changeIsUserEditable':
			return { ...state, userEditState: !state.userEditState }
		case 'changeStatState':
			return { ...state, statState: action.payload }
		default:
			return state
	}
}
