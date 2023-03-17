import { ChangeEvent } from 'react'

import { useUserStateContext } from '../../Providers/UserStateProvider'
import { fetcher, useDebounce } from '../../utils'
import { users } from '../Apis'
import { useHandleUserResponses } from './handleResponses'

export type EventChoiceTypes =
	| ChangeEvent<HTMLInputElement>
	| ChangeEvent<HTMLSelectElement>
	| ChangeEvent<HTMLTextAreaElement>

export const useCreateUser = () => {
	const { userDispatch, formFields } = useUserStateContext()
	const { handleCreateUserResponse } = useHandleUserResponses()

	const createNewUser = () => {
		const { email, first_name, last_name, password, password_2, legal } = formFields
		if (email && password && password_2 && first_name && last_name) {
			if (legal) {
				const newUserObject = {
					email,
					password,
					password_2,
					first_name,
					last_name,
					legal
				}

				return fetcher(users.create.url, {
					method: users.create.method,
					body: newUserObject
				})
					.then(({ data }) => handleCreateUserResponse(data))
					.catch(({ error }) => {
						userDispatch({ type: 'setLoginError', payload: error.message })

						return error
					})
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

	const sendPasswordResetLinkToEmail = ({ email }: { email: string }) => {
		return fetcher(users.sendPasswordResetLink.url, {
			method: users.sendPasswordResetLink.method,
			body: { email }
		}).then(({ data }) => {
			console.log('RESET_LINK_SENT', data)
		})
	}

	// save the new password entered by the user
	const saveUpdatedPassword = ({
		newPassword,
		resetToken
	}: {
		newPassword: string
		resetToken: string
	}) => {
		return fetcher(users.createNewPassword.url, {
			method: users.createNewPassword.method,
			body: { password: newPassword, reset_token: resetToken }
		})
			.then(() => {
				// return cardDispatch({
				// 	type: 'closeCardMessage',
				// 	payload: 'Thank you! You can now log in with your new password.'
				// })
			})
			.catch(console.error)
	}

	return {
		createNewUser,
		sendPasswordResetLinkToEmail,
		saveUpdatedPassword
	}
}

export const useGetUser = () => {
	const { userDispatch, formFields } = useUserStateContext()
	const { handleLoginUserResponse } = useHandleUserResponses()

	// fetch a user's information that isn't the logged in user
	const getNonLoggedInUser = ({ userId }: { userId: number }) => {
		return fetcher(`${users.getById.url}?id=${userId}`, { method: users.getById.method }).then(
			({ data: { user } }) => {
				return userDispatch({ type: 'setWorkingUser', payload: user })
			}
		)
	}

	const searchForUsers = ({ search }: { search: string }) => {
		return fetcher(`${users.searchForUser.url}?search=${search}`, {
			method: users.searchForUser.method
		}).then(({ data: { users } }) => users)
	}

	const searchForFriends = ({ search }: { search: string }) => {
		return fetcher(`${users.searchForFriend.url}?search=${search}`, {
			method: users.searchForFriend.method
		}).then(({ data: { users } }) => users)
	}

	const loginUser = async () => {
		const loginBody = {
			email: formFields.email,
			password: formFields.password
		}

		if (formFields.email && formFields.password) {
			return fetcher(users.login.url, {
				method: users.login.method,
				body: loginBody
			})
				.then(({ data }) => handleLoginUserResponse(data))
				.catch(({ error }) => {
					userDispatch({ type: 'setLoginError', payload: error.message })
					return error
				})
		} else {
			userDispatch({
				type: 'setLoginError',
				payload: 'Email and Password fields are required. Please try again.'
			})
		}
	}

	return {
		getNonLoggedInUser,
		loginUser,
		searchForUsers,
		searchForFriends
	}
}

export const useEditUser = () => {
	const { userDispatch } = useUserStateContext()

	const handleEditRequest = useDebounce(({ name, value }: { name: string; value: string }) => {
		return fetcher(users.edit.url, {
			method: users.edit.method,
			body: { field: { name, value } }
		})
	})

	const editUser = (event: EventChoiceTypes) => {
		userDispatch({
			type: 'setUserEditFields',
			payload: { name: event.target.name, value: event.target.value }
		})
		return handleEditRequest({ name: event.target.name, value: event.target.value })
	}

	return {
		editUser
	}
}

export const useFollowUser = () => {
	const { userDispatch } = useUserStateContext()

	const friendUser = ({ leaderId }: { leaderId: number }) => {
		return fetcher(`${users.followUser.url}?leader_id=${leaderId}`, {
			method: users.followUser.method
		})
			.then(({ data: { user } }) => {
				return userDispatch({ type: 'setLoggedInUser', payload: user })
			})
			.catch(console.error)
	}

	return { friendUser }
}
