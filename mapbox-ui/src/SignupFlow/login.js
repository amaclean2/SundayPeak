import DisplayCard from "../DisplayCard";
import { useCardStateContext } from "../Providers/cardStateProvider";
import { useUserStateContext } from "../Providers/userStateProvider";
import FormField from "../Reusable/FormField";

const LoginFlow = () => {
	const {
		loginFields,
		setLoginFields,
		attemptLogin
	} = useUserStateContext();

	const { closeCard } = useCardStateContext();

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
			closeCard();
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
				<div className="line-info flex-box">
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
					<button onClick={handleLogin} className="button line-edit-button">
						Login
					</button>
				</div>
			</div>
		</DisplayCard>
	);
};

export default LoginFlow;