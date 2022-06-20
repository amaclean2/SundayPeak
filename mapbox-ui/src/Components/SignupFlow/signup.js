import React from 'react';

import { useUserStateContext } from '../../Providers/userStateProvider';
import { FormField, DisplayCard, ProfileHeader, ErrorField, Button } from '../Reusable';

export const SignupFlow = () => {
	const { formFields, setFormFields, attemptSignup } = useUserStateContext();

	const onChange = (e) => {
		setFormFields((currFormFields) => {
			return {
				...currFormFields,
				[e.target.name]: e.target.value
			};
		});
	};

	return (
		<DisplayCard configuration={"center"}>
			<ProfileHeader textContents={'Create a new account with Backyard Friends'} />
			<div className="profile-content">
				<div className="adventure-info flex-box">
					<ErrorField form='login' />
					<FormField
						name="firstName"
						label="First Name"
						hideLabel
						block
						isEditable
						value={formFields.firstName}
						onChange={onChange}
					/>
					<FormField
						name="lastName"
						label="Last Name"
						hideLabel
						block
						isEditable
						value={formFields.lastName}
						onChange={onChange}
					/>
					<FormField
						name="email"
						label="Email"
						hideLabel
						block
						isEditable
						value={formFields.email}
						onChange={onChange}
					/>
					<FormField
						name="password"
						label="Password"
						type="password"
						hideLabel
						block
						isEditable
						value={formFields.password}
						onChange={onChange}
					/>
					<FormField
						name="password2"
						label="Confirm Password"
						type="password"
						hideLabel
						block
						isEditable
						value={formFields.password2}
						onChange={onChange}
					/>
					<FormField
						type='checkbox'
						name='Legal'
						value='legal'
						label={'I agree with the Backyard Friends Privacy Policy'}
						isEditable
						onChange={onChange}
					/>
				</div>
				<div className="action-buttons">
					<Button onClick={attemptSignup} className="button adventure-edit-button">
						Continue
					</Button>
					<div className='create-account-cta'>
						<span>
							Already have an account?
						</span>
						<Button className="button secondary-button new-account-button">
							Log in to Backyard Friends
						</Button>
					</div>
				</div>
			</div>
		</DisplayCard>
	);
};