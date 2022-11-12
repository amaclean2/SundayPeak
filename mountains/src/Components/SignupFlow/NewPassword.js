import React, { useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { CARD_TYPES, useCardStateContext, useCreateUser } from '../../Providers'
import {
	Button,
	DisplayCard,
	ErrorField,
	FieldHeader,
	FooterButtons,
	FormField,
	ProfileContent,
	ProfileHeader
} from '../Reusable'

export const NewPassword = () => {
	const newPasswordObject = {
		password: '',
		confirmPassword: ''
	}
	const [newPassword, setNewPassword] = useState(newPasswordObject)
	const [canRedirect, setCanRedirect] = useState(false)
	const { switchCard, closeCard, setAlertContent, setShowAlert } = useCardStateContext()
	const { updateNewPassword } = useCreateUser()
	const { search } = useLocation()

	const confirmNewPassword = () => {
		if (newPassword.password === newPassword.confirmPassword) {
			const resetToken = search.split('resetToken=')?.[1]
			updateNewPassword({ newPassword: newPassword.password, resetToken })
			closeCard()
			setAlertContent('Thank you! You can now log in with your new password.')
			setShowAlert(true)
			setCanRedirect(true)
		}
	}

	if (canRedirect) {
		return <Navigate to={'/discover'} />
	}

	return (
		<DisplayCard configuration='center'>
			<ProfileHeader>
				<FieldHeader
					className={'page-header signup-header-text'}
					text={'Reset Your Password'}
				/>
			</ProfileHeader>
			<ProfileContent>
				<div className='main-login-content'>
					<div className='adventure-info flex-box reset-form'>
						<ErrorField form='password-reset' />
						<FormField
							name='password'
							label='New Password'
							type='password'
							hideLabel
							isEditable
							autoComplete={'on'}
							value={newPassword.password}
							onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
						/>
						<FormField
							name='confirm'
							label='Confirm Password'
							type='password'
							hideLabel
							isEditable
							autoComplete={'on'}
							value={newPassword.confirmPassword}
							onChange={(e) => setNewPassword({ ...newPassword, confirmPassword: e.target.value })}
						/>
					</div>
				</div>
				<FooterButtons className='reset-buttons'>
					<Button
						id={'confirm-new-password'}
						onClick={confirmNewPassword}
					>
						Reset Password
					</Button>
					<Button
						id='return-to-login'
						className={'secondary-button'}
						onClick={() => switchCard(CARD_TYPES.login)}
					>
						Return to login
					</Button>
				</FooterButtons>
			</ProfileContent>
		</DisplayCard>
	)
}
