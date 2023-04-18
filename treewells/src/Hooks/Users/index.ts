import type { ChangeEvent } from 'react'

import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { FormFieldNameOptions, UserStatType, UserType } from '../../Types/User'
import { fetcher, useDebounce } from '../../utils'
import { users } from '../Apis'
import { useHandleUserResponses } from './handleResponses'

export type EventChoiceTypes =
	| ChangeEvent<HTMLInputElement>
	| ChangeEvent<HTMLSelectElement>
	| ChangeEvent<HTMLTextAreaElement>

export const useCreateUser = (): {
	createNewUser: () => Promise<void>
	sendPasswordResetLinkToEmail: ({ email }: { email: string }) => Promise<void>
	saveUpdatedPassword: ({
		newPassword,
		resetToken
	}: {
		newPassword: string
		resetToken: string
	}) => Promise<void>
} => {
	const { userDispatch, formFields } = useUserStateContext()
	const { handleCreateUserResponse } = useHandleUserResponses()

	const createNewUser = async (): Promise<void> => {
		const { email, first_name, last_name, password, password_2, legal } = formFields
		const allDefined = [email, password, password_2, first_name, last_name].every(
			(field) => field !== undefined && field !== null
		)
		if (allDefined) {
			if (legal !== undefined) {
				const newUserObject = {
					email,
					password,
					password_2,
					first_name,
					last_name,
					legal
				}

				try {
					const { data } = await fetcher(users.create.url, {
						method: users.create.method,
						body: newUserObject
					})

					handleCreateUserResponse(data)
				} catch (error: any) {
					if (error?.message !== undefined) {
						userDispatch({ type: 'setLoginError', payload: error.message })
					} else if (error?.code_error !== undefined) {
						userDispatch({ type: 'setLoginError', payload: error.code_error })
					}
				}
			} else {
				userDispatch({
					type: 'setLoginError',
					payload: `You must agree to the SundayPeak privacy policy.`
				})
			}
		} else {
			userDispatch({
				type: 'setLoginError',
				payload: 'All fields are required. Please complete the form.'
			})
		}
	}

	const sendPasswordResetLinkToEmail = async ({ email }: { email: string }): Promise<void> => {
		const { data } = await fetcher(users.sendPasswordResetLink.url, {
			method: users.sendPasswordResetLink.method,
			body: { email }
		})

		console.log('RESET_LINK_SENT', data)
	}

	// save the new password entered by the user
	const saveUpdatedPassword = async ({
		newPassword,
		resetToken
	}: {
		newPassword: string
		resetToken: string
	}): Promise<void> => {
		await fetcher(users.createNewPassword.url, {
			method: users.createNewPassword.method,
			body: { password: newPassword, reset_token: resetToken }
		})

		console.log('new password created')
	}

	return {
		createNewUser,
		sendPasswordResetLinkToEmail,
		saveUpdatedPassword
	}
}

export const useGetUser = (): {
	getNonLoggedInUser: ({ userId }: { userId: number }) => Promise<void>
	loginUser: () => Promise<void>
	setLoginError: (loginError: string) => void
	searchForUsers: ({ search }: { search: string }) => Promise<UserType[]>
	searchForFriends: ({ search }: { search: string }) => Promise<UserType[]>
	setWorkingUserToCurrentUser: () => void
	logoutUser: () => void
} => {
	const { userDispatch, formFields, loggedInUser } = useUserStateContext()
	const { handleLoginUserResponse } = useHandleUserResponses()

	// fetch a user's information that isn't the logged in user
	const getNonLoggedInUser = async ({ userId }: { userId: number }): Promise<void> => {
		const {
			data: { user }
		} = await fetcher(`${users.getById.url}?id=${userId}`, { method: users.getById.method })
		userDispatch({ type: 'setWorkingUser', payload: user })
	}

	const searchForUsers = async ({ search }: { search: string }): Promise<UserType[]> => {
		const {
			data: { users: responseUsers }
		} = await fetcher(`${users.searchForUser.url}?search=${search}`, {
			method: users.searchForUser.method
		})

		return responseUsers
	}

	const searchForFriends = async ({ search }: { search: string }): Promise<UserType[]> => {
		const {
			data: { users: responseUsers }
		} = await fetcher(`${users.searchForFriend.url}?search=${search}`, {
			method: users.searchForFriend.method
		})

		return responseUsers
	}

	const loginUser = async (): Promise<void> => {
		const loginBody = {
			email: formFields.email,
			password: formFields.password
		}

		if (formFields.email !== undefined && formFields.password !== undefined) {
			try {
				const { data } = await fetcher(users.login.url, {
					method: users.login.method,
					body: loginBody
				})

				handleLoginUserResponse(data)
			} catch (error: any) {
				if (error.message !== undefined) {
					userDispatch({ type: 'setLoginError', payload: error.message })
				}
			}
		} else {
			userDispatch({
				type: 'setLoginError',
				payload: 'Email and Password fields are required. Please try again.'
			})
		}
	}

	const setLoginError = (loginError: string): void => {
		userDispatch({ type: 'setLoginError', payload: loginError })
	}

	const setWorkingUserToCurrentUser = (): void => {
		userDispatch({ type: 'setWorkingUser', payload: loggedInUser as UserType })
	}

	const logoutUser = (): void => {
		userDispatch({ type: 'logout' })
	}

	return {
		getNonLoggedInUser,
		loginUser,
		setLoginError,
		searchForUsers,
		searchForFriends,
		setWorkingUserToCurrentUser,
		logoutUser
	}
}

export const useEditUser = (): {
	editUser: (event: EventChoiceTypes) => Promise<void>
	editFormFields: (field: { name: FormFieldNameOptions; value: string | number | boolean }) => void
	changeUserStatView: (newUserStatView: UserStatType) => void
	toggleUserEditState: () => void
} => {
	const { userDispatch } = useUserStateContext()

	const handleEditRequest = useDebounce(
		async ({ name, value }: { name: string; value: string }): Promise<void> => {
			return await fetcher(users.edit.url, {
				method: users.edit.method,
				body: { field: { name, value } }
			})
		}
	)

	const editUser = async (event: EventChoiceTypes): Promise<void> => {
		userDispatch({
			type: 'setUserEditFields',
			payload: { name: event.target.name, value: event.target.value }
		})
		return handleEditRequest({ name: event.target.name, value: event.target.value })
	}

	const changeUserStatView = (newUserStatView: UserStatType): void => {
		userDispatch({ type: 'changeStatView', payload: newUserStatView })
	}

	const editFormFields = (field: {
		name: FormFieldNameOptions
		value: string | number | boolean
	}): void => {
		userDispatch({ type: 'setFormFields', payload: field })
	}

	const toggleUserEditState = (): void => {
		userDispatch({ type: 'switchIsUserEditable' })
	}

	return {
		editUser,
		editFormFields,
		changeUserStatView,
		toggleUserEditState
	}
}

export const useFollowUser = (): {
	friendUser: ({ leaderId }: { leaderId: number }) => Promise<void>
} => {
	const { userDispatch } = useUserStateContext()

	const friendUser = async ({ leaderId }: { leaderId: number }): Promise<void> => {
		try {
			const {
				data: { user }
			} = await fetcher(`${users.followUser.url}?leader_id=${leaderId}`, {
				method: users.followUser.method
			})

			userDispatch({ type: 'setLoggedInUser', payload: user })
		} catch (error) {
			console.error(error)
		}
	}

	return { friendUser }
}
