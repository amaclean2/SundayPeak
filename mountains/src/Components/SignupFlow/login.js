import { useNavigate } from 'react-router-dom'
import { useEditUser, useGetUser, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import { useEffect } from 'react'

import { title } from 'Router/AppContent'
import { ErrorField, DisplayCard, FormField, Button, FooterButtons } from '../Reusable'

import './styles.css'

export const LoginFlow = () => {
	const { formFields, loggedInUser } = useUserStateContext()
	const { loginUser, setUserError } = useGetUser()
	const { editFormFields } = useEditUser()
	const navigate = useNavigate()

	const onChange = (event) => {
		editFormFields({ name: event.target.name, value: event.target.value })
	}

	useEffect(() => {
		if (loggedInUser?.id) {
			navigate('/discover')
		}
	}, [loggedInUser])

	return (
		<DisplayCard
			configuration={'center'}
			title={`Login to ${title}`}
			onClose={() => navigate('/discover')}
			className='login-card'
		>
			<ErrorField form='login' />
			<FormField
				name='email'
				label='Email'
				type='email'
				testId='email'
				block
				hideLabel
				isEditable
				autoComplete={'on'}
				value={formFields.email}
				onChange={onChange}
			/>
			<FormField
				name='password'
				label='Password'
				type='password'
				testId='password'
				block
				hideLabel
				isEditable
				autoComplete={'on'}
				value={formFields.password}
				onChange={onChange}
			/>
			<FooterButtons>
				<Button
					onClick={loginUser}
					id={'login-button'}
					className='cta-button'
				>
					Log In
				</Button>
				<Button
					secondaryButton
					className='forgot-button secondary-button'
					onClick={() => navigate('/password-reset')}
					id={'forgot-password-button'}
				>
					Forgot my password?
				</Button>
				<div className='create-account-cta'>
					<span>Not already signed up?</span>
					<Button
						className='secondary-button new-account-button'
						id={'switch-to-create-button'}
						onClick={() => {
							setUserError('')
							navigate('/signup')
						}}
					>
						Create a new account
					</Button>
				</div>
			</FooterButtons>
		</DisplayCard>
	)
}
