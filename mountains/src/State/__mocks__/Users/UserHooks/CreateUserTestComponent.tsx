import { SundayPeakProviders } from '../../../Providers'
import React, { useEffect } from 'react'
import { Connections } from '../../../config'
import { type EventChoiceTypes, useEditUser, useCreateUser } from '../../../Hooks/Users'
import { useUserStateContext } from '../../../Providers/UserStateProvider'
import { useCardStateContext } from '../../../Providers/CardStateProvider'

Connections.setConnections(
	{ restUrl: 'http://api.sundaypeak.com', websocketUrl: 'ws://api.sundaypeak.com:4000' },
	localStorage
)

const UserTestHooks = (): JSX.Element => {
	const { formFields, loggedInUser } = useUserStateContext()
	const { alertContent, showAlert } = useCardStateContext()
	const { editFormFields } = useEditUser()
	const { createNewUser } = useCreateUser()

	useEffect(() => {
		editFormFields({ name: 'legal', value: true })
	}, [])

	return (
		<div>
			<span>Alert content view: {alertContent}</span>
			<span>Alert is shown: {showAlert.toString()}</span>
			<span>Logged in user view: {loggedInUser?.first_name}</span>

			<div>
				{Object.entries(formFields).map((field, key) => (
					<span key={key}>
						{field[0]} value: {field[1] as string}
					</span>
				))}
			</div>
			<button onClick={createNewUser}>Create New User</button>
			<input
				type={'text'}
				data-testid={'first-name'}
				name={'first_name'}
				value={formFields.first_name ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'first_name', value: event.target.value })
				}}
			/>
			<input
				type={'text'}
				data-testid={'last-name'}
				name={'last_name'}
				value={formFields.last_name ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'last_name', value: event.target.value })
				}}
			/>
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
			<input
				type={'text'}
				name={'password_2'}
				data-testid={'password-2'}
				value={formFields.password_2 ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'password_2', value: event.target.value })
				}}
			/>
		</div>
	)
}

const CreateUserTestWrapper = (): JSX.Element => {
	return (
		<SundayPeakProviders>
			<UserTestHooks />
		</SundayPeakProviders>
	)
}

export default CreateUserTestWrapper
