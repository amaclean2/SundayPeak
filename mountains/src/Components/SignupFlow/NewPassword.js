import { useLocation, useNavigate } from 'react-router-dom'
import {
	useCreateUser,
	useEditUser,
	useGetUser,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, ErrorField, FooterButtons, FormField } from 'Components/Reusable'

export const NewPassword = () => {
	const { saveUpdatedPassword } = useCreateUser()
	const { editFormFields } = useEditUser()
	const { formFields } = useUserStateContext()
	const { setLoginError } = useGetUser()
	const { search } = useLocation()
	const navigate = useNavigate()

	const isMobile = localStorage.getItem('isMobile') === 'true'

	const confirmNewPassword = async () => {
		if (formFields.password && formFields.password === formFields.password_2) {
			const resetToken = search.split('resetToken=')?.[1]
			return saveUpdatedPassword({ resetToken }).catch((error) => {
				console.log({ error })
			})
		} else {
			setLoginError('Your password and confirm password fields have to match')
		}
	}

	return (
		<DisplayCard
			configuration='center'
			title={'Reset Your Password'}
			onClose={() => navigate('/discover')}
			hasClose={!isMobile}
		>
			<ErrorField form='login' />
			<p className={'desc'}>Enter your new password to reset it</p>
			<FormField
				name='password'
				label='New Password'
				type='password'
				hideLabel
				isEditable
				value={formFields.password}
				onChange={(e) => editFormFields({ name: 'password', value: e.target.value })}
			/>
			<FormField
				name='password_2'
				label='Confirm Password'
				type='password'
				hideLabel
				isEditable
				value={formFields.password_2}
				onChange={(e) => editFormFields({ name: 'password_2', value: e.target.value })}
			/>
			<FooterButtons className='reset-buttons'>
				<Button
					direction={isMobile ? 'sp://login' : '/discover'}
					onClick={confirmNewPassword}
					type={'button'}
					id={'confirm-new-password'}
				>
					Reset Password
				</Button>
				{!isMobile && (
					<Button
						id='return-to-login'
						className={'secondary-button'}
						onClick={() => navigate('/login')}
					>
						Return to Login
					</Button>
				)}
			</FooterButtons>
		</DisplayCard>
	)
}
