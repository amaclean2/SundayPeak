import React, { useState } from 'react'
import { useUserStateContext } from '../../Providers/UserStateProvider'

const UserTestConsumer = (): JSX.Element | null => {
	const [isFormField, setIsFormField] = useState(true)
	const { loginError, workingUser, loggedInUser, formFields, userEditState, userDispatch } =
		useUserStateContext()

	const addWorkingUser = (): void => {
		userDispatch({
			type: 'setWorkingUser',
			payload: {
				first_name: 'Yvonne',
				last_name: 'Choinard',
				id: 1,
				email: 'yvonne@email.com',
				completed_adventures: [],
				todo_adventures: [],
				friends: []
			}
		})
	}

	const addLoggedInUser = (): void => {
		userDispatch({
			type: 'setLoggedInUser',
			payload: {
				first_name: 'Doug',
				last_name: 'Tompkins',
				id: 2,
				email: 'doug@thenorthface.com',
				completed_adventures: [],
				todo_adventures: [],
				friends: []
			}
		})
	}

	const triggerError = (): void => {
		userDispatch({ type: 'setLoginError', payload: 'New Login Error' })
	}

	const handleNameChange = (event: EventChoiceTypes): void => {
		userDispatch({
			type: isFormField ? 'setFormFields' : 'setUserEditFields',
			payload: { name: event.target.name as 'first_name', value: event.target.value }
		})
	}

	const handleClearForm = (): void => {
		userDispatch({ type: 'clearForm' })
	}

	const handleLogout = (): void => {
		userDispatch({ type: 'logout' })
	}

	const switchIsEditable = (): void => {
		userDispatch({ type: 'switchIsUserEditable' })
	}

	return (
		<div>
			<span>Any errors here: {loginError}</span>
			<span>Working username: {workingUser?.first_name}</span>
			<span>Logged in username: {loggedInUser?.first_name}</span>
			<span>Form fields name: {formFields.first_name}</span>
			<span>Is user editable: {userEditState.toString()}</span>

			{/* Provider Testing */}
			<button onClick={triggerError}>Trigger Error</button>
			<button
				onClick={() => {
					setIsFormField(false)
				}}
			>
				Toggle Form Field
			</button>
			<button onClick={addWorkingUser}>Add Working User</button>
			<button onClick={addLoggedInUser}>Add Logged in User</button>
			<button onClick={handleClearForm}>Clear Form</button>
			<button onClick={switchIsEditable}>Switch Edit State</button>
			<button onClick={handleLogout}>Logout</button>

			<input
				type={'text'}
				data-testid={'form-field-input'}
				onChange={handleNameChange}
				value={formFields.first_name ?? ''}
				name={'first_name'}
			/>

			{/* Hooks Testing */}
		</div>
	)
}

export default UserTestConsumer
