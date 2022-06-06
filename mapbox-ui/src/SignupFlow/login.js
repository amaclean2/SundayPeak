import React from 'react';

import DisplayCard from "../DisplayCard";
import { useUserStateContext } from "../Providers/userStateProvider";
import ErrorField from '../Reusable/ErrorField';
import FormField from "../Reusable/FormField";

const LoginFlow = () => {
	const {
		loginFields,
		setLoginFields,
		attemptLogin,
		loginError
	} = useUserStateContext();

	const onChange = (e) => {
		setLoginFields((currLoginFields) => {
			return {
				...currLoginFields,
				[e.target.name]: e.target.value
			};
		});
	};

	const handleLogin = () => {
		attemptLogin().then((resp) => {
			console.log(resp);
		});
	};

	return (
		<DisplayCard>
			<div className="profile-header">
				<FormField
					value={'Login'}
					isEditable={false}
					className="card-header"
				/>
			</div>
			<div className="profile-content">
				<div className="adventure-info flex-box">
					{loginError && <ErrorField error={loginError} />}
					<FormField
						name="email"
						label="Email"
						isEditable={true}
						value={loginFields.email}
						onChange={onChange}
					/>
					<FormField
						name="password"
						label="Password"
						type="password"
						isEditable={true}
						value={loginFields.password}
						onChange={onChange}
					/>
				</div>
				<div className="action-buttons">
					<button onClick={handleLogin} className="button adventure-edit-button">
						Login
					</button>
				</div>
			</div>
		</DisplayCard>
	);
};

export default LoginFlow;