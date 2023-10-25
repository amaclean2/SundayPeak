import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCreateUser, useGetUser } from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, ErrorField, FooterButtons, FormField } from 'Components/Reusable'

export const NewPassword = () => {
	const { updateNewPassword } = useCreateUser()
	const { setLoginError } = useGetUser()
	const { search } = useLocation()
	const navigate = useNavigate()

	const initialNewPasswordObject = {
		password: '',
		confirmPassword: ''
	}

	const [newPasswordObject, setNewPasswordObject] = useState(initialNewPasswordObject)

	const confirmNewPassword = async () => {
		if (newPasswordObject.password === newPasswordObject.confirmPassword) {
			const resetToken = search.split('resetToken=')?.[1]
			await updateNewPassword({ newPassword: newPasswordObject.password, resetToken })
			navigate('/discover')
		} else {
			setLoginError('Your password and confirm password fields have to match')
		}
	}

	return (
		<DisplayCard
			configuration='center'
			title={'Reset Your Password'}
			onClose={() => navigate('/discover')}
		>
			<ErrorField form='login' />
			<p className={'desc'}>Enter your new password to reset it</p>
			<FormField
				name='password'
				label='New Password'
				type='password'
				hideLabel
				isEditable
				autoComplete={'on'}
				value={newPasswordObject.password}
				onChange={(e) => setNewPasswordObject({ ...newPasswordObject, password: e.target.value })}
			/>
			<FormField
				name='confirm'
				label='Confirm Password'
				type='password'
				hideLabel
				isEditable
				autoComplete={'on'}
				value={newPasswordObject.confirmPassword}
				onChange={(e) =>
					setNewPasswordObject({ ...newPasswordObject, confirmPassword: e.target.value })
				}
			/>
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
					onClick={() => navigate('/login')}
				>
					Return to Login
				</Button>
			</FooterButtons>
		</DisplayCard>
	)
}
