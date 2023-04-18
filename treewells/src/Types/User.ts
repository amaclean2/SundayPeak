import type { Dispatch } from 'react'
import type { AdventureChoiceType } from './Adventures'

export type CompletedAdventureForUserType = {
	adventure_id: number
	adventure_name: string
	adventure_type: AdventureChoiceType
	creator_id: number
	nearest_city: string
}

export type TodoAdventureForUserType = {
	adventure_id: number
	adventure_name: string
	adventure_type: AdventureChoiceType
	nearest_city: string
}

type FriendType = {
	display_name: string
	email: string
	id: number
}

export type UserStatType = 'friends' | 'completed'

export type UserType = {
	bio?: string
	city?: string
	email: string
	first_name: string
	last_name: string
	id: number
	phone?: string
	user_site?: string
	completed_adventures: CompletedAdventureForUserType[]
	todo_adventures: TodoAdventureForUserType[]
	friends: FriendType[]
}

type LoginErrorType = {
	type: 'setLoginError'
	payload: string
}

type SetWorkingUserType = {
	type: 'setWorkingUser'
	payload: UserType
}

type EditUserType = {
	type: 'setUserEditFields'
	payload: {
		name: string
		value: string
	}
}

type LoginUserType = {
	type: 'setLoggedInUser'
	payload: UserType
}

type LogoutType = {
	type: 'logout'
}

export type FormFieldNameOptions =
	| 'first_name'
	| 'last_name'
	| 'email'
	| 'city'
	| 'bio'
	| 'password'
	| 'password_2'
	| 'phone'
	| 'user_site'
	| 'legal'

type FormFieldsType = {
	type: 'setFormFields'
	payload: {
		name: FormFieldNameOptions
		value: string | number | boolean
	}
}

type ClearFormType = {
	type: 'clearForm'
}

type IsUserEditableType = {
	type: 'switchIsUserEditable'
}

type ChangeStatType = {
	type: 'changeStatView'
	payload: UserStatType
}

export type UserAction =
	| LoginErrorType
	| SetWorkingUserType
	| EditUserType
	| LoginUserType
	| LogoutType
	| FormFieldsType
	| ClearFormType
	| IsUserEditableType
	| ChangeStatType

export type UserState = {
	loginError: null | string
	workingUser: UserType | null
	loggedInUser: UserType | null
	formFields: any
	userEditState: boolean
	statView: string
	searchList: null
	images: string[]
}

export type UserContext = UserState & { userDispatch: Dispatch<UserAction> }