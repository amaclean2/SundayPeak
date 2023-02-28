import { useRef } from 'react'
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

export const PasswordResetCapture = () => {
	const { cardDispatch } = useCardStateContext()
	const resetEmail = useRef('')
	const { sendPasswordResetLink } = useCreateUser()

	const handleResetButton = () => {
		sendPasswordResetLink({ email: resetEmail.current })
		cardDispatch({
			type: 'closeCardMessage',
			payload: 'An email has been sent to reset your password'
		})
	}

	return (
		<DisplayCard configuration='center'>
			<ProfileHeader>
				<FieldHeader
					pageHeader
					className={'signup-header-text'}
					text={'Reset Your Password'}
				/>
			</ProfileHeader>
			<ProfileContent>
				<div className='main-login-content'>
					<div className='adventure-info flex-box reset-form'>
						<ErrorField form='password-reset' />
						<FormField
							name='email'
							label='Enter your email to get a reset link sent to you'
							type='email'
							placeholder={'email'}
							isEditable
							autoComplete={'on'}
							value={resetEmail.current}
							onChange={(e) => (resetEmail.current = e.target.value)}
						/>
					</div>
				</div>
				<FooterButtons className='reset-buttons'>
					<Button
						id={'send-reset-email'}
						onClick={handleResetButton}
					>
						Send Reset Email
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
