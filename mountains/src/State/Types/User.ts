import type { Dispatch } from 'react'
import type { ShortAdventure } from './Adventures'
import type { URLType } from './Cards'

export type ShortUser = {
	user_id: number
	display_name: string
	first_name: string
	email: string
	profile_picture_url: string
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
	completed_adventures: ShortAdventure[]
	todo_adventures: ShortAdventure[]
	friends: ShortUser[]
	images: URLType[]
	profile_picture_url: URLType
}

type UserErrorType = {
	type: 'setUserError'
	payload: string
}

type UpdateImagesType = {
	type: 'updateImages'
	payload: URLType
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

type DeleteUserType = {
	type: 'deleteUser'
}

type LogoutType = {
	type: 'logout'
}

type UpdateProfileImageType = {
	type: 'updateProfileImage'
	payload: URLType
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
	payload?: boolean
}

type ChangeStatType = {
	type: 'changeStatView'
	payload: UserStatType
}

type DeleteImageType = {
	type: 'deleteImage'
	payload: URLType
}

type DeleteProfileImageType = {
	type: 'deleteProfileImage'
}

export type UserAction =
	| UserErrorType
	| SetWorkingUserType
	| EditUserType
	| LoginUserType
	| LogoutType
	| FormFieldsType
	| ClearFormType
	| IsUserEditableType
	| ChangeStatType
	| UpdateImagesType
	| UpdateProfileImageType
	| DeleteImageType
	| DeleteProfileImageType
	| DeleteUserType

export type UserState = {
	userError: null | string
	workingUser: UserType | null
	loggedInUser: UserType | null
	formFields: any
	userEditState: boolean
	statView: string
	searchList: null
}

export type UserContext = UserState & { userDispatch: Dispatch<UserAction> }
