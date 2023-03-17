import { Dispatch } from 'react'
import { AdventureChoiceType } from './Adventures'

type CompletedAdventureForUserType = {
	adventure_id: number
	adventure_name: string
	adventure_type: AdventureChoiceType
	creator_id: number
	nearest_city: string
}

type TodoAdventureForUserType = {
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

type FormFieldsType = {
	type: 'setFormFields'
	payload: {
		name: string
		value: string
	}
}

type ClearFormType = {
	type: 'clearForm'
}

type IsUserEditableType = {
	type: 'changeIsUserEditable'
}

type ChangeStatType = {
	type: 'changeStatState'
	payload: 'friends' | 'completed'
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
	workingUser: UserType
	loggedInUser: UserType
	formFields: any
	userEditState: boolean
	statState: string
	searchList: null
	images: string[]
}

export type UserContext = UserState & { userDispatch: Dispatch<UserAction> }
