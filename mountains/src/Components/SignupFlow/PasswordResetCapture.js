import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, DisplayCard, ErrorField, FooterButtons, FormField } from 'Components/Reusable'
import { useCardStateContext } from 'Hooks/Providers'
import { useCreateUser } from 'Hooks'

export const PasswordResetCapture = () => {
	const { cardDispatch } = useCardStateContext()
	const [resetEmail, setResetEmail] = useState('')
	const { sendPasswordResetLink } = useCreateUser()

	const handleResetButton = () => {
		sendPasswordResetLink({ email: resetEmail })
		cardDispatch({
			type: 'closeCardMessage',
			payload: 'An email has been sent to reset your password'
		})
	}

	return (
		<DisplayCard
			configuration='center'
			title={'Reset Your Password'}
		>
			<ErrorField form='password-reset' />
			<FormField
				name='email'
				label='Enter your email to get a reset link sent to you'
				type='email'
				placeholder={'email'}
				isEditable
				autoComplete={'on'}
				value={resetEmail}
				onChange={(e) => setResetEmail(e.target.value)}
			/>
			<FooterButtons className='reset-buttons'>
				<Button
					id={'send-reset-email'}
					onClick={handleResetButton}
					className={'cta-button'}
				>
					Send Reset Email
				</Button>
				<Link
					id='return-to-login'
					className={'secondary-button button flex-box'}
					to={'/login'}
				>
					Return to login
				</Link>
			</FooterButtons>
		</DisplayCard>
	)
}
