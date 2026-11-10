import { Storage } from '../../config'
import type { URLType } from '../../Types/Cards'
import type { UserAction, UserState, UserType } from '../../Types/User'

export const initialUserState: UserState = {
	userError: null,
	workingUser: null,
	loggedInUser: null,
	formFields: {},
	userEditState: false,
	statView: 'completed', // the toggle between friends and stats view
	searchList: null
}

export const userReducer = (state: UserState, action: UserAction): UserState => {
	switch (action.type) {
		case 'setWorkingUser':
			return { ...state, workingUser: action.payload }
		case 'setUserEditFields':
			return {
				...state,
				loggedInUser: {
					...(state.loggedInUser as UserType),
					[action.payload.name]: action.payload.value
				},
				workingUser: {
					...(state.workingUser as UserType),
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
				userError: null,
				formFields: {}
			}
		case 'updateImages':
			return {
				...state,
				loggedInUser: {
					...(state.loggedInUser as UserType),
					images: [...(state.loggedInUser?.images as URLType[]), action.payload]
				},
				workingUser: state.loggedInUser as UserType
			}
		case 'deleteImage':
			return {
				...state,
				loggedInUser: {
					...(state.loggedInUser as UserType),
					images: (state.loggedInUser?.images as URLType[])?.filter(
						(image) => image !== action.payload
					)
				},
				workingUser: state.loggedInUser as UserType
			}
		case 'deleteProfileImage':
			return {
				...state,
				loggedInUser: {
					...(state.loggedInUser as UserType),
					profile_picture_url: '' as URLType
				},
				workingUser: state.loggedInUser as UserType
			}
		case 'updateProfileImage':
			return {
				...state,
				loggedInUser: {
					...(state.loggedInUser as UserType),
					profile_picture_url: action.payload
				},
				workingUser: state.loggedInUser as UserType
			}
		case 'logout':
			Storage.clear()
			return { ...state, loggedInUser: null }
		case 'setUserError':
			return { ...state, userError: action.payload }
		case 'setFormFields':
			return {
				...state,
				formFields: { ...state.formFields, [action.payload.name]: action.payload.value },
				userError: null
			}
		case 'deleteUser':
			return {
				...state,
				loggedInUser: null,
				workingUser: null
			}
		case 'clearForm':
			return { ...state, userError: null, formFields: {} }
		case 'switchIsUserEditable':
			return {
				...state,
				userEditState: action.payload !== undefined ? action.payload : !state.userEditState
			}
		case 'changeStatView':
			return { ...state, statView: action.payload }
		default:
			return state
	}
}
