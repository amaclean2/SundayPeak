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
		loginError,
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
		setLoginError(null);
		setLoginFields({});
	};

	return (
		<DisplayCard onClose={handleOnClose} position={"center"}>
			<div className="profile-header">
				<FormField
					value={'Log In'}
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
						autoComplete={'on'}
						value={loginFields.email}
						onChange={onChange}
					/>
					<FormField
						name="password"
						label="Password"
						type="password"
						isEditable={true}
						autoComplete={'on'}
						value={loginFields.password}
						onChange={onChange}
					/>
				</div>
				<div className="action-buttons">
					<button onClick={attemptLogin} className="button adventure-edit-button">
						Log In
					</button>
				</div>
			</div>
		</DisplayCard>
	);
};

export default LoginFlow;