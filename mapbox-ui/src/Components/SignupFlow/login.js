import React from 'react';
import { useCardStateContext, useLoginUser } from '../../Providers';

import { useUserStateContext } from "../../Providers/userStateProvider";
import { ErrorField, DisplayCard, ProfileHeader, FormField, Button } from '../Reusable';

import './styles.css';

export const LoginFlow = () => {
	const {
		formFields,
		setFormFields,
		setLoginError
	} = useUserStateContext();

	const { attemptLogin } = useLoginUser();
	const { switchCard } = useCardStateContext();

	const onChange = (e) => {
		setFormFields((currFormFields) => {
			return {
				...currFormFields,
				[e.target.name]: e.target.value
			};
		});
	};

	const handleOnClose = () => {
		setLoginError('');
		setFormFields({});
	};

	return (
		<DisplayCard onClose={handleOnClose} configuration={"center"}>
			<ProfileHeader textContents={'Login to Backyard Friends'} textClassName={'login-header'} />
			<div className="profile-content">
				<div className="adventure-info flex-box">
					<ErrorField form='login' />
					<FormField
						name="email"
						label="Email"
						block
						hideLabel
						isEditable
						autoComplete={'on'}
						value={formFields.email}
						onChange={onChange}
					/>
					<FormField
						name="password"
						label="Password"
						type="password"
						block
						hideLabel
						isEditable
						autoComplete={'on'}
						value={formFields.password}
						onChange={onChange}
					/>
				</div>
				<div className="action-buttons cta-buttons flex-box">
					<Button secondaryButton className='forgot-button secondary-button' id='forgot-password-button'>
						Forgot my password?
					</Button>
					<Button onClick={attemptLogin} className="button adventure-edit-button login-cta">
						Log In
					</Button>
					<div className='create-account-cta'>
						<span>Not already signed up?</span>
						<Button
							className="button secondary-button new-account-button"
							onClick={() => switchCard('signup')}
						>
							Create a new account
						</Button>
					</div>
				</div>
			</div>
		</DisplayCard>
	);
};