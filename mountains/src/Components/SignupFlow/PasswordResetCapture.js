import { useState } from 'react'
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
	const { switchCard, closeCard, setAlertContent, setShowAlert } = useCardStateContext()
	const [fieldValue, setFieldValue] = useState('')
	const { sendPasswordResetLink } = useCreateUser()

	const handleResetButton = () => {
		sendPasswordResetLink({ email: fieldValue })
		closeCard()
		setAlertContent('An email has been sent to reset your password')
		setShowAlert(true)
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
							name='email'
							label='Enter your email to get a reset link sent to you'
							type='email'
							placeholder={'email'}
							isEditable
							autoComplete={'on'}
							value={fieldValue}
							onChange={(e) => setFieldValue(e.target.value)}
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
						onClick={() => switchCard(CARD_TYPES.login)}
					>
						Return to login
					</Button>
				</FooterButtons>
			</ProfileContent>
		</DisplayCard>
	)
}
