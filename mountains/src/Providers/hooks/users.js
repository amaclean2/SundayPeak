import { fetcher } from '../utils'
import { useUserStateContext } from '../userStateProvider'
import { useCardStateContext } from '../cardStateProvider'
import { useAdventureEditContext } from '../adventureEditProvider'

export const useSignupUser = () => {
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
		const { email, password, firstName, lastName, password_2, legal } = formFields

		if (email && password && password_2 && firstName && lastName) {
			if (legal) {
				const newUserObject = {
					email,
					password,
					password_2,
					first_name: firstName,
					last_name: lastName,
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
					.catch((error) => {
						console.error(error)
						setLoginError(error.message)

						return error
					})
			} else {
				setLoginError('You must agree to the Backyard Friends terms and conditions.')
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
	const { closeCard } = useCardStateContext()
	const { setMapboxToken } = useAdventureEditContext()

	const getInitialCall = () => {
		return fetcher('/initial')
			.then(({ data }) => {
				console.log('INITIAL_CALL', data)
				setMapboxToken(data.mapbox_token)

				if (!!data.user) {
					setLoggedInUser(data.user)
					setIsLoggedIn(true)
					setIsLandingPage(false)
				} else {
					setLoggedInUser(null)
					setIsLoggedIn(false)
				}

				return data
			})
			.catch((error) => {
				console.error(error)
				setIsLoggedIn(false)

				return error
			})
	}

	const getOtherUser = ({ user_id }) => {
		return fetcher(`/users/id?id=${user_id}`)
			.then(({ data }) => {
				setWorkingUser(data.user)

				return data
			})
			.catch(console.error)
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

export const useFollowUser = () => {
	const followUser = ({ leaderId }) => {
		return fetcher(`/users/follow?leader_id=${leaderId}`)
			.then(({ data }) => {
				return data
			})
			.catch(console.error)
	}

	return { followUser }
}

export const useSubmitPicture = () => {
	const { refetchUser } = useGetUser()

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

	return {
		submitPicture
	}
}

export const useDeletePicture = () => {
	const deletePicture = ({ pictureRef }) => {
		return fetcher(`/pictures/delete`, {
			method: 'POST',
			body: { file_name: pictureRef }
		}).catch(console.error)
	}

	return {
		deletePicture
	}
}
