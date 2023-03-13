import { useNavigate } from 'react-router-dom'

import { fetcher, useDebounce } from 'Hooks/Providers/utils'
import { useUserStateContext } from 'Hooks/Providers/userStateProvider'
import { useCardStateContext } from 'Hooks/Providers/cardStateProvider'
import { title } from 'App'

export const useCreateUser = () => {
	const { userDispatch, formFields } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const navigate = useNavigate()

	const signupUser = async () => {
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

				return fetcher('/users/create', {
					method: 'POST',
					body: newUserObject
				})
					.then(({ data: { user, token } }) => {
						console.log('USER_CREATED', user)

						cardDispatch({
							type: 'closeCardMessage',
							payload: `User ${user.first_name} ${user.last_name} created!\nGet started with a new adventure.`
						})

						userDispatch({ type: 'loginUser', payload: user })
						localStorage.setItem('token', token)

						navigate('/discover')

						return {
							user,
							token
						}
					})
					.catch(({ error }) => {
						userDispatch({ type: 'loginError', payload: error.message })

						return error
					})
			} else {
				userDispatch({
					type: 'loginError',
					payload: `You must agree to the ${title} privacy policy.`
				})
			}
		} else {
			userDispatch({ type: 'loginError', payload: 'All fields are required. Please try again.' })
		}
	}

	const sendPasswordResetLink = ({ email }) => {
		return fetcher('/users/passwordResetLink', {
			method: 'POST',
			body: { email }
		}).then(({ data }) => {
			console.log('RESET_LINK_SENT', data)
		})
	}

	const updateNewPassword = ({ newPassword, resetToken }) => {
		return fetcher('/users/newPassword', {
			method: 'POST',
			body: { password: newPassword, reset_token: resetToken }
		})
			.then(() => {
				return cardDispatch({
					type: 'closeCardMessage',
					payload: 'Thank you! You can now log in with your new password.'
				})
			})
			.catch(console.error)
	}

	return {
		signupUser,
		sendPasswordResetLink,
		updateNewPassword
	}
}

export const useGetUser = () => {
	const { userDispatch, formFields } = useUserStateContext()
	const navigate = useNavigate()

	const getOtherUser = ({ userId }) => {
		return fetcher(`/users/id?id=${userId}`).then(({ data: { user } }) => {
			return userDispatch({ type: 'workingUser', payload: user })
		})
	}

	const searchUsers = ({ search }) => {
		return fetcher(`/users/search?search=${search}`).then(({ data: { users } }) => users)
	}

	const searchFriends = ({ search }) => {
		return fetcher(`/users/friendSearch?search=${search}`).then(({ data: { users } }) => users)
	}

	const loginUser = async () => {
		const loginBody = {
			email: formFields.email,
			password: formFields.password
		}

		if (formFields.email && formFields.password) {
			return fetcher('/users/login', {
				method: 'POST',
				body: loginBody
			})
				.then(({ data: { user, token } }) => {
					userDispatch({ type: 'loginUser', payload: user })
					localStorage.setItem('token', token)
					navigate('/discover')
					return { user, token }
				})
				.catch(({ error }) => {
					userDispatch({ type: 'loginError', payload: error.message })
					return error
				})
		} else {
			userDispatch({
				type: 'loginError',
				payload: 'Email and Password fields are required. Please try again.'
			})
		}
	}

	return {
		getOtherUser,
		loginUser,
		searchUsers,
		searchFriends
	}
}

export const useEditUser = () => {
	const { userDispatch } = useUserStateContext()

	const handleEditRequest = useDebounce(({ name, value }) => {
		return fetcher(`/users/edit`, {
			method: 'PUT',
			body: { field: { name, value } }
		})
	})

	const editUser = (event) => {
		userDispatch({
			type: 'editUser',
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
	const friendUser = ({ leaderId }) => {
		return fetcher(`/users/follow?leader_id=${leaderId}`)
			.then(({ data: { user } }) => {
				return userDispatch({ type: 'updateLoggedInUser', payload: user })
			})
			.catch(console.error)
	}

	return { friendUser }
}

export const useUserPictures = () => {
	const deletePicture = ({ pictureRef }) => {
		return fetcher(`/pictures/delete`, {
			method: 'POST',
			body: { file_name: pictureRef }
		}).catch(console.error)
	}

	const submitPicture = ({ data }) => {
		const formData = new FormData()
		formData.append('image', data)

		return fetcher('/pictures/userUpload', {
			method: 'POST',
			headers: [{ name: 'content-type', value: 'none' }],
			body: formData
		}).catch(console.error)
	}

	const updateProfilePicture = ({ data }) => {
		const formData = new FormData()
		formData.append('image', data)

		return fetcher('/pictures/userUpload?profile_image=true', {
			method: 'POST',
			headers: [{ name: 'content-type', value: 'none' }],
			body: formData
		}).catch(console.error)
	}

	return {
		submitPicture,
		deletePicture,
		updateProfilePicture
	}
}
