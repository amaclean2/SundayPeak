import React from 'react';

import DisplayCard from "../DisplayCard";
import ProfileHeader from '../DisplayCard/ProfileHeader';
import { useUserStateContext } from "../Providers/userStateProvider";
import ErrorField from '../Reusable/ErrorField';
import FormField from "../Reusable/FormField";

import './styles.css';

const LoginFlow = () => {
	const {
		loginFields,
		setLoginFields,
		attemptLogin,
		setLoginError
	} = useUserStateContext();

	const onChange = (e) => {
		setLoginFields((currLoginFields) => {
			return {
				...currLoginFields,
				[e.target.name]: e.target.value
			};
		});
	};

	const handleOnClose = () => {
		setLoginError('');
		setLoginFields({});
	};

	return (
		<DisplayCard onClose={handleOnClose} configuration={"center"}>
			<ProfileHeader textContents={'Login to Backyard Friends'} configuration={'centered'} />
			<div className="profile-content">
				<div className="adventure-info flex-box">
					<ErrorField form='login' />
					<FormField
						name="email"
						label="Email"
						fullWidth
						hideLabel
						isEditable
						autoComplete={'on'}
						value={loginFields.email}
						onChange={onChange}
					/>
					<FormField
						name="password"
						label="Password"
						type="password"
						fullWidth
						hideLabel
						isEditable
						autoComplete={'on'}
						value={loginFields.password}
						onChange={onChange}
					/>
				</div>
				<div className="action-buttons flex-box cta-buttons">
					<button className="button secondary-button forgot-button">
						Forgot my password?
					</button>
					<button onClick={attemptLogin} className="button adventure-edit-button login-cta">
						Log In
					</button>
					<div className='create-account-cta'>
						<span>
							Not already signed up?
						</span>
						<button className="button secondary-button new-account-button">
							Create a new account
						</button>
					</div>
				</div>
			</div>
		</DisplayCard>
	);
};

export default LoginFlow;