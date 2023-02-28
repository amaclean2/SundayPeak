import { useNavigate } from 'react-router-dom'
import { title } from '../../App'
import { CARD_TYPES, useCardStateContext, useGetUser } from '../../Providers'

import { useUserStateContext } from '../../Providers/userStateProvider'
import {
	ErrorField,
	DisplayCard,
	ProfileHeader,
	FormField,
	Button,
	FieldHeader,
	FooterButtons,
	ProfileContent
} from '../Reusable'

import './styles.css'

export const LoginFlow = () => {
	const { formFields, userDispatch } = useUserStateContext()

	const { loginUser } = useGetUser()
	const { cardDispatch } = useCardStateContext()
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

	const handleOnClose = () => {
		userDispatch({ type: 'clearForm' })
		navigate('/discover')
	}

	const handleLogin = () => {
		loginUser().then(() => navigate('/discover'))
	}

	return (
		<DisplayCard
			onClose={handleOnClose}
			configuration={'center'}
		>
			<ProfileHeader
				className='signup-header'
				configuration={'center'}
			>
				<FieldHeader
					className='signup-header-text'
					pageHeader
					text={`Login to ${title}`}
				/>
			</ProfileHeader>
			<ProfileContent className={'main-login-content'}>
				<div className='adventure-info flex-box login-form'>
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
				</div>
				<FooterButtons>
					<Button
						onClick={handleLogin}
						id={'login-button'}
						className='cta-button'
					>
						Log In
					</Button>
					<Button
						secondaryButton
						className='forgot-button secondary-button'
						onClick={() => {
							cardDispatch({ type: 'switchCard', payload: CARD_TYPES.password_reset })
							navigate('/discover')
						}}
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
								cardDispatch({ type: 'switchCard', payload: CARD_TYPES.signup })
								navigate('/discover')
							}}
						>
							Create a new account
						</Button>
					</div>
				</FooterButtons>
			</ProfileContent>
		</DisplayCard>
	)
}
