import React from 'react';

import { useUserStateContext } from '../../Providers/userStateProvider';
import { FormField, DisplayCard, ProfileHeader, ErrorField } from '../Reusable';

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
						block
						hideLabel
						isEditable
						value={formFields.firstName}
						onChange={onChange}
					/>
					<FormField
						name="lastName"
						label="Last Name"
						block
						hideLabel
						isEditable
						value={formFields.lastName}
						onChange={onChange}
					/>
					<FormField
						name="email"
						label="Email"
						block
						hideLabel
						isEditable
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
						value={formFields.city}
						onChange={onChange}
					/>
					<FormField
						name="password2"
						label="Confirm Password"
						type="password"
						block
						hideLabel
						isEditable
						value={formFields.bio}
						onChange={onChange}
					/>
					{/* <FormField
						type='checkbox'
						name='Legal'
						value='legal'
						label={'I agree with Backyard Friends\' Privacy Policy'}
						isEditable
						onChange={onChange}
					/> */}
				</div>
				<div className="action-buttons">
					<button onClick={attemptSignup} className="button adventure-edit-button">
						Continue
					</button>
				</div>
			</div>
		</DisplayCard>
	);
};