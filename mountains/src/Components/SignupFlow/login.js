import { useNavigate } from 'react-router-dom'

import { title } from 'App'
import { useGetUser } from 'Hooks'
import { useUserStateContext } from 'Hooks/Providers'
import { ErrorField, DisplayCard, FormField, Button, FooterButtons } from '../Reusable'

import './styles.css'
import { useEffect } from 'react'

export const LoginFlow = () => {
	const { formFields, userDispatch, loggedInUser } = useUserStateContext()

	const { loginUser } = useGetUser()
	const navigate = useNavigate()

	const onChange = (e) => {
		userDispatch({
			type: 'formFields',
			payload: {
				...formFields,
				[e.target.name]: e.target.value
			}
		})
	}

	useEffect(() => {
		if (loggedInUser?.id) {
			navigate('/discover')
		}
	}, [])

	return (
		<DisplayCard
			configuration={'center'}
			title={`Login to ${title}`}
			onClose={() => navigate('/discover')}
		>
			<ErrorField form='login' />
			<FormField
				name='email'
				label='Email'
				type='email'
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
							userDispatch({ type: 'loginError', payload: '' })
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
