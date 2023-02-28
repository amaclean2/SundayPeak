import { fetcher } from 'Providers/utils'
import { useUserStateContext } from 'Providers/userStateProvider'
import { CARD_TYPES, useCardStateContext } from 'Providers/cardStateProvider'
import { useAdventureStateContext } from 'Providers/adventureStateProvider'
import { title } from 'App'
import { useHandleMessages } from './messages'
import { useMessagingStateContext } from 'Providers/messagingStateProvider'
import { useTokenStateContext } from 'Providers/tokensProvider'

export const useCreateUser = () => {
	const { userDispatch, formFields } = useUserStateContext()
	const { createNewMessagingUser } = useHandleMessages()
	const { cardDispatch } = useCardStateContext()

	const signupUser = () => {
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

						createNewMessagingUser({
							id: user.id,
							email: user.email,
							profile_picture_url: user.profile_picture_url,
							name: `${user.first_name} ${user.last_name}`
						})

						return {
							user,
							token
						}
					})
					.catch(({ error }) => {
						console.error(error)
						userDispatch({ type: 'loginError', payload: error.message })

						return error
					})
			} else {
				userDispatch({
					type: 'loginError',
					payload: `You must agree to the ${title} terms and conditions.`
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
	const { tokenDispatch } = useTokenStateContext()
	const { cardDispatch } = useCardStateContext()

	const getInitialCall = () => {
		return fetcher('/services/initial')
			.then(({ data }) => {
				console.log('INITIAL_CALL', data)
				tokenDispatch({
					type: 'setTokens',
					payload: {
						mapboxToken: data.mapbox_token,
						firebaseApiKey: data.firebase_api_key,
						mapboxStyleKey: data.user?.map_style || data.map_style,
						mpaboxStyles: data.mapbox_styles
					}
				})
				if (!!data.user) {
					userDispatch({ type: 'loginUser', payload: data.user })
				} else {
					userDispatch({ type: 'loginUser', payload: null })
					localStorage.clear()
				}

				return data
			})
			.catch((error) => {
				console.error(error)
				userDispatch({ type: 'loginUser', payload: null })

				return error
			})
	}

	const getOtherUser = ({ userId, profileSwitch }) => {
		return fetcher(`/users/id?id=${userId}`).then(({ data: { user } }) => {
			userDispatch({ type: 'workingUser', payload: user })
			if (profileSwitch) {
				cardDispatch({ type: 'switchCard', payload: CARD_TYPES.profile })
			}
			return user
		})
	}

	const searchUsers = ({ keywords }) => {
		return fetcher(`/users/search?queryString=${keywords}`).then(({ data: { users } }) => users)
	}

	const searchFriends = ({ keywords }) => {
		return fetcher(`/users/friendSearch?queryString=${keywords}`).then(
			({ data: { users } }) => users
		)
	}

	const loginUser = () => {
		const loginBody = {
			email: formFields.email,
			password: formFields.password
		}

		if (formFields.email && formFields.password) {
			return fetcher('/users/login', {
				method: 'POST',
				body: loginBody
			})
				.then(({ data }) => {
					console.log('LOGGED_IN_USER', data.user)

					localStorage.setItem('token', JSON.stringify(data.token))

					userDispatch({ type: 'loginUser', payload: data.user })
					cardDispatch({ type: 'closeCard' })

					return data
				})
				.catch(({ error }) => {
					console.error(error)
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

	const refetchUser = () => {
		return fetcher('/users/refetch')
			.then(({ data }) => {
				userDispatch({ type: 'loginUser', payload: data.user })
				return data
			})
			.catch((error) => {
				console.error(error)
				return error
			})
	}

	return {
		getOtherUser,
		loginUser,
		getInitialCall,
		refetchUser,
		searchUsers,
		searchFriends
	}
}

export const useEditUser = () => {
	const { formFields } = useUserStateContext()

	const handleSaveEditUser = () => {
		const fieldKeys = Object.keys(formFields)
		const formattedFields = fieldKeys.map((key) => ({
			name: key,
			value: formFields[key]
		}))

		return fetcher(`/users/edit`, {
			method: 'PUT',
			body: {
				fields: formattedFields
			}
		}).then(console.log)
	}

	return {
		handleSaveEditUser
	}
}

export const useFollowUser = () => {
	const { userDispatch } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()

	const followUser = ({ leaderId, followerId }) => {
		return fetcher(`/users/follow`, {
			method: 'POST',
			body: {
				leader_id: leaderId
			}
		})
			.then(async ({ data }) => {
				cardDispatch({ type: 'openAlert', payload: `You have followed ${data.leader_name}.` })
			})
			.then(() => getFriends({ userId: followerId }))
			.catch(console.error)
	}

	const getFriends = ({ userId }) => {
		return fetcher(`/users/friends?user_id=${userId}`)
			.then(({ data }) => {
				userDispatch({ type: 'friends', payload: data.friends })
				return data
			})
			.catch(console.error)
	}

	return { followUser, getFriends }
}

export const useUserPictures = () => {
	const { refetchUser } = useGetUser()

	const deletePicture = ({ pictureRef }) => {
		return fetcher(`/pictures/delete`, {
			method: 'POST',
			body: { file_name: pictureRef }
		})
			.then(refetchUser)
			.catch(console.error)
	}

	const submitPicture = ({ data }) => {
		const formData = new FormData()
		formData.append('image', data)

		return fetcher('/pictures/userUpload', {
			method: 'POST',
			headers: [{ name: 'content-type', value: 'none' }],
			body: formData
		})
			.then(refetchUser)
			.catch(console.error)
	}

	const updateProfilePicture = ({ data }) => {
		const formData = new FormData()
		formData.append('image', data)

		return fetcher('/pictures/userUpload?profile_image=true', {
			method: 'POST',
			headers: [{ name: 'content-type', value: 'none' }],
			body: formData
		})
			.then(() => refetchUser())
			.catch(console.error)
	}

	return {
		submitPicture,
		deletePicture,
		updateProfilePicture
	}
}
