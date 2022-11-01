import { fetcher } from '../utils'
import { useUserStateContext } from '../userStateProvider'
import { CARD_STATES, useCardStateContext } from '../cardStateProvider'
import { useAdventureEditContext } from '../adventureEditProvider'
import { title } from '../../App'

export const useCreateUser = () => {
	const {
		setLoginError,
		setLoggedInUser,
		setIsLoggedIn,
		setIsLandingPage,
		formFields,
		setFormFields
	} = useUserStateContext()
	const { closeCard } = useCardStateContext()

	const signupUser = () => {
		const { email, first_name, last_name, password, password_2, legal } = formFields

		console.log(formFields)

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
					.then(({ data }) => {
						console.log('USER_CREATED', data)

						setLoggedInUser(data.user)
						setIsLoggedIn(true)
						setIsLandingPage(false)
						setFormFields({})

						localStorage.setItem('token', data.token)
						closeCard()

						return data
					})
					.catch(({ error }) => {
						console.error(error)
						setLoginError(error.message)

						return error
					})
			} else {
				setLoginError(`You must agree to the ${title} terms and conditions.`)
			}
		} else {
			setLoginError('All fields are required. Please try again.')
		}
	}

	return {
		signupUser
	}
}

export const useGetUser = () => {
	const {
		setLoginError,
		setLoggedInUser,
		setWorkingUser,
		setIsLoggedIn,
		setIsLandingPage,
		formFields,
		setFormFields
	} = useUserStateContext()
	const { closeCard, switchCard } = useCardStateContext()
	const { setMapboxToken, setMapStyle } = useAdventureEditContext()

	const getInitialCall = () => {
		return fetcher('/services/initial')
			.then(({ data }) => {
				console.log('INITIAL_CALL', data)
				setMapboxToken(data.mapbox_token)
				if (!!data.user) {
					setLoggedInUser(data.user)
					setMapStyle(data.user.map_style)
					setIsLoggedIn(true)
					setIsLandingPage(false)
				} else {
					setLoggedInUser(null)
					setMapStyle(data.map_style)
					setIsLoggedIn(false)
					localStorage.clear()
				}

				return data
			})
			.catch((error) => {
				console.error(error)
				setIsLoggedIn(false)

				return error
			})
	}

	const getOtherUser = ({ userId }) => {
		return fetcher(`/users/id?id=${userId}`).then(({ data }) => {
			setWorkingUser(data.user)
			switchCard(CARD_STATES.profile)
			return data
		})
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

					setLoggedInUser(data.user)
					setIsLoggedIn(true)
					setIsLandingPage(false)
					setFormFields({})
					setLoginError('')
					closeCard()

					return data
				})
				.catch((error) => {
					console.error(error)
					setLoginError(error.message)
					return error
				})
		} else {
			setLoginError('Email and Password fields are required. Please try again.')
		}
	}

	const refetchUser = () => {
		return fetcher('/users/refetch')
			.then(({ data }) => {
				setLoggedInUser(data.user)
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
		refetchUser
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

	const getMapboxStyles = () => {
		return fetcher('/services/mapboxStyles').then(({ data: { mapbox_styles } }) => mapbox_styles)
	}

	return {
		handleSaveEditUser,
		getMapboxStyles
	}
}

export const useFollowUser = () => {
	const { setLoggedInUser, setWorkingUser, setFriends } = useUserStateContext()
	const followUser = ({ leaderId }) => {
		return fetcher(`/users/follow`, {
			method: 'POST',
			body: {
				leader_id: leaderId
			}
		})
			.then(({ data }) => {
				setLoggedInUser(data.user)
				setWorkingUser(data.user)
				return data
			})
			.catch(console.error)
	}

	const getFriends = ({ userId }) => {
		return fetcher(`/users/friends?user_id=${userId}`)
			.then(({ data }) => {
				setFriends(data.friends)
				return data
			})
			.catch(console.error)
	}

	return { followUser, getFriends }
}

export const usePictures = () => {
	const { refetchUser } = useGetUser()

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
		})
			.then(() => refetchUser())
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
