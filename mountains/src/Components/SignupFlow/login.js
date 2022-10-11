import React from 'react'
import { CARD_STATES, useCardStateContext, useGetUser } from '../../Providers'

import { useUserStateContext } from '../../Providers/userStateProvider'
import {
	ErrorField,
	DisplayCard,
	ProfileHeader,
	FormField,
	Button,
	FieldHeader,
	FooterButtons
} from '../Reusable'

import './styles.css'

export const LoginFlow = () => {
	const { formFields, setFormFields, setLoginError } = useUserStateContext()

	const { loginUser } = useGetUser()
	const { switchCard } = useCardStateContext()

	const onChange = (e) => {
		setFormFields((currFormFields) => {
			return {
				...currFormFields,
				[e.target.name]: e.target.value
			}
		})
	}

	const handleOnClose = () => {
		setLoginError('')
		setFormFields({})
	}

	return (
		<DisplayCard
			onClose={handleOnClose}
			configuration={'center'}
		>
			<ProfileHeader className='signup-header'>
				<FieldHeader
					className='page-header signup-header-text'
					text={'Login to Backyard Friends'}
				/>
			</ProfileHeader>
			<div className='profile-content'>
				<div className='main-login-content'>
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
				</div>
				<FooterButtons className='signup-buttons'>
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
						id={'forgot-password-button'}
					>
						Forgot my password?
					</Button>
					<div className='create-account-cta'>
						<span>Not already signed up?</span>
						<Button
							className='secondary-button new-account-button'
							id={'switch-to-create-button'}
							onClick={() => switchCard(CARD_STATES.signup)}
						>
							Create a new account
						</Button>
					</div>
				</FooterButtons>
			</div>
		</DisplayCard>
	)
}
