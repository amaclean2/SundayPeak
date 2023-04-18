import React from 'react'

import { SundayPeakProviders } from '../../../Providers'
import { Connections } from '../../../config'
import { type EventChoiceTypes, useEditUser, useGetUser } from '../../../Hooks/Users'
import { useUserStateContext } from '../../../Providers/UserStateProvider'

Connections.setConnections(
	{ restUrl: 'http://api.sundaypeak.com', websocketUrl: 'ws://api.sundaypeak.com:4000' },
	localStorage
)

const UserTestHooks = (): JSX.Element => {
	const { formFields, loggedInUser, loginError } = useUserStateContext()
	const { editFormFields } = useEditUser()
	const { loginUser, setLoginError } = useGetUser()

	return (
		<div>
			<span>Login error: {loginError}</span>
			<span>Logged in user view: {loggedInUser?.first_name}</span>
			<div>
				{Object.entries(formFields).map((field, key) => (
					<span key={key}>
						{field[0]} value: {field[1] as string}
					</span>
				))}
			</div>

			<button onClick={() => setLoginError('New Login Error')}>Set Login Error</button>
			<button onClick={loginUser}>Login User</button>
			<input
				type={'text'}
				name={'email'}
				data-testid={'email'}
				value={formFields.email ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'email', value: event.target.value })
				}}
			/>
			<input
				type={'text'}
				name={'password'}
				data-testid={'password'}
				value={formFields.password ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'password', value: event.target.value })
				}}
			/>
		</div>
	)
}

const LoginUserTestWrapper = (): JSX.Element => {
	return (
		<SundayPeakProviders>
			<UserTestHooks />
		</SundayPeakProviders>
	)
}

export default LoginUserTestWrapper
