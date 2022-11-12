import { useNavigate } from 'react-router-dom'
import { title } from '../../App'
import {
	CARD_TYPES,
	useCardStateContext,
	useCreateUser,
	useUserStateContext
} from '../../Providers'

import {
	FormField,
	DisplayCard,
	ProfileHeader,
	ErrorField,
	Button,
	FieldHeader,
	FooterButtons,
	ProfileContent
} from '../Reusable'

export const SignupFlow = () => {
	const { formFields, setFormFields, setLoginError } = useUserStateContext()
	const { switchCard } = useCardStateContext()
	const { signupUser } = useCreateUser()
	const navigate = useNavigate()

	const onChange = (e) => {
		setFormFields((currFormFields) => {
			return {
				...currFormFields,
				[e.target.name]: e.target.value
			}
		})
		setLoginError(null)
	}

	const onClose = () => {
		setFormFields({})
		setLoginError(null)
		navigate('/discover')
	}

	const handleSignup = () => {
		signupUser().then(() => navigate('/discover'))
	}

	return (
		<DisplayCard
			configuration={'center'}
			onClose={onClose}
		>
			<ProfileHeader className='signup-header'>
				<FieldHeader
					className='page-header signup-header-text'
					text={`Sign up with ${title}`}
				/>
			</ProfileHeader>
			<ProfileContent>
				<div className='main-login-content'>
					<div className='adventure-info flex-box signup-form'>
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
							label={`I agree with the ${title} Privacy Policy`}
							isEditable
							onChange={onChange}
						/>
					</div>
				</div>
				<FooterButtons className='signup-buttons'>
					<Button
						onClick={handleSignup}
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
								switchCard(CARD_TYPES.login)
								navigate('/discover')
							}}
						>
							Login to {title}
						</Button>
					</div>
				</FooterButtons>
			</ProfileContent>
		</DisplayCard>
	)
}
