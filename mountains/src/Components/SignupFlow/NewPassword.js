import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	CARD_TYPES,
	useCardStateContext,
	useCreateUser,
	useUserStateContext
} from '../../Providers'
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
	const { cardDispatch } = useCardStateContext()
	const { userDispatch } = useUserStateContext()
	const { updateNewPassword } = useCreateUser()
	const { search } = useLocation()
	const navigate = useNavigate()

	const newPasswordObject = {
		password: '',
		confirmPassword: ''
	}

	const newPassword = useRef(newPasswordObject)

	const confirmNewPassword = async () => {
		if (newPassword.current.password === newPassword.current.confirmPassword) {
			const resetToken = search.split('resetToken=')?.[1]
			await updateNewPassword({ newPassword: newPassword.current.password, resetToken })
			navigate('/discover')
		} else {
			userDispatch({
				type: 'loginError',
				payload: 'Your password and confirm password fields have to match'
			})
		}
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
						<ErrorField form='login' />
						<FormField
							name='password'
							label='New Password'
							type='password'
							hideLabel
							isEditable
							autoComplete={'on'}
							value={newPassword.password}
							onChange={(e) =>
								(newPassword.current = { ...newPassword.current, password: e.target.value })
							}
						/>
						<FormField
							name='confirm'
							label='Confirm Password'
							type='password'
							hideLabel
							isEditable
							autoComplete={'on'}
							value={newPassword.confirmPassword}
							onChange={(e) =>
								(newPassword.current = { ...newPassword.current, confirmPassword: e.target.value })
							}
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
						onClick={() => cardDispatch({ type: 'switchCard', payload: CARD_TYPES.login })}
					>
						Return to login
					</Button>
				</FooterButtons>
			</ProfileContent>
		</DisplayCard>
	)
}
