import {
	useCreateUser,
	useEditUser,
	useManipulateFlows,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, ErrorField, FooterButtons, FormField } from 'Components/Reusable'

export const PasswordResetCapture = () => {
	const { sendPasswordResetLinkToEmail } = useCreateUser()
	const { editFormFields } = useEditUser()
	const { formFields } = useUserStateContext()
	const { closeCard } = useManipulateFlows()

	const handleResetButton = () => {
		sendPasswordResetLinkToEmail()
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
				value={formFields.email}
				onChange={(e) => editFormFields({ name: e.target.name, value: e.target.value })}
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
					Return to Login
				</Button>
			</FooterButtons>
		</DisplayCard>
	)
}
