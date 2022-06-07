import React from 'react';

import DisplayCard from "../DisplayCard";
import { useUserStateContext } from "../Providers/userStateProvider";
import FormField from "../Reusable/FormField";

const SignupFlow = () => {
	const { userFields, setUserFields } = useUserStateContext();

	const onChange = (e) => {
		setUserFields((currUserFields) => {
			return {
				...currUserFields,
				[e.target.name]: e.target.value
			};
		});
	};;

	const saveUser = (e) => { };

	return (
		<DisplayCard position={"center"}>
			<div className="profile-header">
				<FormField
					value={'Create a New Account'}
					isEditable={false}
					className="card-header"
				/>
			</div>
			<div className="profile-content">
				<div className="adventure-info flex-box">
					<FormField
						name="firstName"
						label="First Name"
						isEditable={true}
						value={userFields.firstName}
						onChange={onChange}
					/>
					<FormField
						name="email"
						label="Email"
						isEditable={true}
						value={userFields.email}
						onChange={onChange}
					/>
					<FormField
						name="lastName"
						label="Last Name"
						isEditable={true}
						value={userFields.lastName}
						onChange={onChange}
					/>
					<FormField
						name="city"
						label="City"
						isEditable={true}
						value={userFields.city}
						onChange={onChange}
					/>
					<FormField
						name="bio"
						label="Biography"
						isEditable={true}
						value={userFields.bio}
						onChange={onChange}
					/>
				</div>
				<div className="action-buttons">
					<button onClick={saveUser} className="button adventure-edit-button">
						Sign Up
					</button>
				</div>
			</div>
		</DisplayCard>
	);
};

export default SignupFlow;