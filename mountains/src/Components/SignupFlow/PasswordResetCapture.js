import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreateUser, useManipulateFlows } from 'sundaypeak-treewells'

import { Button, DisplayCard, ErrorField, FooterButtons, FormField } from 'Components/Reusable'

export const PasswordResetCapture = () => {
	const [resetEmail, setResetEmail] = useState('')
	const { sendPasswordResetLink } = useCreateUser()
	const { closeCard } = useManipulateFlows()

	const handleResetButton = () => {
		sendPasswordResetLink({ email: resetEmail })
		closeCard('An email has been sent to reset your password')
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
