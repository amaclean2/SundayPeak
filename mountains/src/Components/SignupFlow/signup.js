import { useNavigate } from 'react-router-dom'
import { useCreateUser, useEditUser, useGetUser, useUserStateContext } from 'sundaypeak-treewells'
import { useEffect } from 'react'

import { title } from 'Router/AppContent'

import { FormField, DisplayCard, ErrorField, Button, FooterButtons } from 'Components/Reusable'

export const SignupFlow = () => {
	const { formFields, loggedInUser } = useUserStateContext()
	const { createNewUser } = useCreateUser()
	const { editFormFields } = useEditUser()
	const { setLoginError } = useGetUser()
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
			title={`Sign up with ${title}`}
			onClose={() => navigate('/discover')}
		>
			<ErrorField
				form='login'
				className='signup-error'
			/>
			<FormField
				onChange={onChange}
				type='text'
				name='first_name'
				label='First Name'
				isEditable
				hideLabel
				block
				value={formFields.first_name}
			/>
			<FormField
				onChange={onChange}
				type='text'
				name='last_name'
				label='Last Name'
				hideLabel
				isEditable
				block
				value={formFields.last_name}
			/>
			<FormField
				type='email'
				name='email'
				label='Email'
				hideLabel
				isEditable
				block
				value={formFields.email}
				onChange={onChange}
			/>
			<FormField
				name='password'
				label='Password'
				type='password'
				hideLabel
				block
				isEditable
				value={formFields.password}
				onChange={onChange}
			/>
			<FormField
				name='password_2'
				label='Confirm Password'
				type='password'
				hideLabel
				block
				isEditable
				value={formFields.password_2}
				onChange={onChange}
			/>
			<FormField
				type='checkbox'
				name='legal'
				value={formFields.legal}
				label={
					<span>
						I agree with the {title} <Button direction='/privacy'>Privacy Policy</Button>
					</span>
				}
				isEditable
				onChange={onChange}
			/>
			<FooterButtons>
				<Button
					onClick={createNewUser}
					id={'create-account-button'}
					className='cta-button'
				>
					Create Account
				</Button>
				<div className='create-account-cta'>
					<span>Already have an account?</span>
					<Button
						className='secondary-button new-account-button'
						id={'switch-to-login-button'}
						onClick={() => {
							setLoginError('')
							navigate('/login')
						}}
					>
						Login to {title}
					</Button>
				</div>
			</FooterButtons>
		</DisplayCard>
	)
}
