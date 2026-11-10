import type { ChangeEvent } from 'react'

import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { FormFieldNameOptions, UserStatType, UserType } from '../../Types/User'
import { fetcher, useDebounce } from '../../utils'
import { Connections } from '../../config'
import { usersApi } from '../Apis'
import { useHandleUserResponses } from './handleResponses'

export type EventChoiceTypes =
	| ChangeEvent<HTMLInputElement>
	| ChangeEvent<HTMLSelectElement>
	| ChangeEvent<HTMLTextAreaElement>
	| { target: { name: string; value: string } }

export const useCreateUser = (): {
	createNewUser: () => Promise<void>
	sendPasswordResetLinkToEmail: () => Promise<void>
	saveUpdatedPassword: ({ resetToken }: { resetToken: string }) => Promise<void>
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
					legal,
					native: Connections.platform === 'native'
				}

				try {
					const { data } = await fetcher(usersApi.create.url, {
						method: usersApi.create.method,
						body: newUserObject
					})

					handleCreateUserResponse(data)
				} catch (error: any) {
					const { error: errorBody } = error
					if (errorBody?.message !== undefined) {
						userDispatch({ type: 'setUserError', payload: errorBody.message })
						throw new Error(errorBody.message)
					} else if (errorBody?.code_error !== undefined) {
						userDispatch({ type: 'setUserError', payload: errorBody.code_error })
						throw new Error(errorBody.error_code)
					} else {
						throw new Error(error)
					}
				}
			} else {
				userDispatch({
					type: 'setUserError',
					payload: `You must agree to the SundayPeak privacy policy.`
				})
				throw new Error(`You must agree to the SundayPeak privacy policy.`)
			}
		} else {
			userDispatch({
				type: 'setUserError',
				payload: 'All fields are required. Please complete the form.'
			})
			throw new Error('All fields are required. Please complete the form.')
		}
	}

	const sendPasswordResetLinkToEmail = async (): Promise<void> => {
		try {
			await fetcher(usersApi.sendPasswordResetLink.url, {
				method: usersApi.sendPasswordResetLink.method,
				body: { email: formFields.email }
			})
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'error sending reset email' })
			throw error
		}
	}

	// save the new password entered by the user
	const saveUpdatedPassword = async ({ resetToken }: { resetToken: string }): Promise<void> => {
		try {
			await fetcher(usersApi.createNewPassword.url, {
				method: usersApi.createNewPassword.method,
				body: { password: formFields.password, reset_token: resetToken }
			})
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'server error: saving the new password' })
			throw error
		}
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
	setUserError: (userError: string) => void
	setWorkingUserToCurrentUser: () => void
	logoutUser: () => void
} => {
	const { userDispatch, formFields, loggedInUser } = useUserStateContext()
	const { handleLoginUserResponse } = useHandleUserResponses()

	// fetch a user's information that isn't the logged in user
	const getNonLoggedInUser = async ({ userId }: { userId: number }): Promise<void> => {
		try {
			const {
				data: { user }
			} = await fetcher(`${usersApi.getById.url}?id=${userId}`, { method: usersApi.getById.method })
			userDispatch({ type: 'setWorkingUser', payload: user })
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'could not get user' })
			throw error
		}
	}

	const loginUser = async (): Promise<void> => {
		const loginBody = {
			email: formFields.email,
			password: formFields.password,
			native: Connections.platform === 'native'
		}

		if (formFields.email !== undefined && formFields.password !== undefined) {
			try {
				const { data } = await fetcher(usersApi.login.url, {
					method: usersApi.login.method,
					body: loginBody
				})

				return handleLoginUserResponse(data)
			} catch (error: any) {
				const { error: errorBody } = error
				if (errorBody?.message !== undefined) {
					userDispatch({ type: 'setUserError', payload: errorBody.message })
				}
				// throw new Error(error)
			}
		} else {
			userDispatch({
				type: 'setUserError',
				payload: 'Email and Password fields are required. Please try again.'
			})
		}
	}

	const setUserError = (userError: string): void => {
		userDispatch({ type: 'setUserError', payload: userError })
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
		setUserError,
		setWorkingUserToCurrentUser,
		logoutUser
	}
}

export const useEditUser = (): {
	editUser: (event: EventChoiceTypes) => Promise<void>
	editFormFields: (field: { name: FormFieldNameOptions; value: string | number | boolean }) => void
	changeUserStatView: (newUserStatView: UserStatType) => void
	toggleUserEditState: (val?: boolean) => void
	deleteUser: (confirmation: boolean) => Promise<void>
} => {
	const { userDispatch } = useUserStateContext()

	const handleEditRequest = useDebounce(
		async ({ name, value }: { name: string; value: string }): Promise<void> => {
			try {
				await fetcher(usersApi.edit.url, {
					method: usersApi.edit.method,
					body: { field: { name, value } }
				})
			} catch (error) {
				userDispatch({ type: 'setUserError', payload: 'user edit request failed' })
				throw error
			}
		}
	)

	const editUser = async (event: EventChoiceTypes): Promise<void> => {
		userDispatch({
			type: 'setUserEditFields',
			payload: { name: event.target.name, value: event.target.value }
		})
		handleEditRequest({ name: event.target.name, value: event.target.value })
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

	const toggleUserEditState = (val?: boolean): void => {
		userDispatch({ type: 'switchIsUserEditable', ...(val !== undefined && { payload: val }) })
	}

	const deleteUser = async (confirmation: boolean): Promise<void> => {
		try {
			if (confirmation) {
				await fetcher(usersApi.delete.url, {
					method: usersApi.delete.method
				})

				userDispatch({ type: 'deleteUser' })
			} else {
				throw new Error('Confirmation parameter is required to delete a user')
			}
		} catch (error) {
			console.log({ error })
			userDispatch({ type: 'setUserError', payload: 'user delete request failed' })
		}
	}

	return {
		editUser,
		editFormFields,
		changeUserStatView,
		toggleUserEditState,
		deleteUser
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
			} = await fetcher(`${usersApi.followUser.url}?leader_id=${leaderId}`, {
				method: usersApi.followUser.method
			})

			userDispatch({ type: 'setLoggedInUser', payload: user })
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'failed to follow user' })
			throw error
		}
	}

	return { friendUser }
}
