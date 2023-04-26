import { useState } from 'react'
import { useCreateUser, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, ErrorField, FooterButtons, FormField } from 'Components/Reusable'

export const PasswordResetCapture = () => {
	const [resetEmail, setResetEmail] = useState('')
	const { sendPasswordResetLinkToEmail } = useCreateUser()
	const { closeCard } = useManipulateFlows()

	const handleResetButton = () => {
		sendPasswordResetLinkToEmail({ email: resetEmail })
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
				<Button
					id='return-to-login'
					className={'secondary-button'}
					direction={'/login'}
				>
					Return to login
				</Button>
			</FooterButtons>
		</DisplayCard>
	)
}
