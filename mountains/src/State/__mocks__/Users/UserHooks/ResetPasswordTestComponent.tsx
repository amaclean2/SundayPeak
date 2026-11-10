import React from 'react'

import { SundayPeakProviders } from '../../../Providers'
import { Connections } from '../../../config'
import { type EventChoiceTypes, useEditUser, useCreateUser } from '../../../Hooks/Users'
import { useUserStateContext } from '../../../Providers/UserStateProvider'

Connections.setConnections(
	{ restUrl: 'http://api.sundaypeak.com', websocketUrl: 'ws://api.sundaypeak.com:4000' },
	localStorage
)

const UserTestHooks = (): JSX.Element => {
	const { formFields } = useUserStateContext()
	const { editFormFields } = useEditUser()
	const { sendPasswordResetLinkToEmail, saveUpdatedPassword } = useCreateUser()

	return (
		<div>
			<button onClick={sendPasswordResetLinkToEmail}>Reset Password</button>
			<button
				onClick={() => {
					saveUpdatedPassword({ resetToken: '123' })
				}}
			>
				Save Updated Password
			</button>
			<input
				type={'email'}
				data-testid={'email'}
				name={'email'}
				value={formFields.email ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'email', value: event.target.value })
				}}
			/>
			<input
				type={'text'}
				data-testid={'password'}
				name={'password'}
				value={formFields.email ?? ''}
				onChange={(event: EventChoiceTypes) => {
					editFormFields({ name: 'password', value: event.target.value })
				}}
			/>
		</div>
	)
}

const ResetPasswordTestWrapper = (): JSX.Element => {
	return (
		<SundayPeakProviders>
			<UserTestHooks />
		</SundayPeakProviders>
	)
}

export default ResetPasswordTestWrapper
