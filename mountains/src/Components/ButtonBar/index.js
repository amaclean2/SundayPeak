import { useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { Button, FlexSpacer } from 'Components/Reusable'
import getContent from 'TextContent'
import LogoInline from 'Images/Logos/LogoInline'

import './styles.css'

const LoginButton = () => (
	<Button
		headerButton
		id='login-button-adventures'
		direction='/login'
	>
		{getContent('buttonText.login')}
	</Button>
)

const SignUpButton = () => (
	<Button
		headerButton
		direction={'/signup'}
		id={'signup-button-adventures'}
	>
		{getContent('buttonText.signup')}
	</Button>
)

const ChatButton = () => (
	<Button
		headerButton
		id={'open-conversations-mobile'}
		direction={'/conversations'}
	>
		Conversations
	</Button>
)

const UserProfileButton = () => (
	<Button
		headerButton
		id='user-profile-button'
		direction={'/user'}
	>
		{getContent('buttonText.profile')}
	</Button>
)

const AdventuresButton = () => (
	<Button
		headerButton
		id='button-adventures'
		direction={'/adventure'}
	>
		{getContent('buttonText.adventures')}
	</Button>
)

const ButtonBar = () => {
	const { loggedInUser } = useUserStateContext()
	const isLoggedIn = !!loggedInUser?.id

	return (
		<>
			<div className='button-bar flex-box'>
				<div className='regular-buttons flex-box'>
					{!isLoggedIn && <SignUpButton />}
					{!isLoggedIn && <LoginButton />}
					<AdventuresButton />
					{isLoggedIn && <UserProfileButton />}
					{isLoggedIn && <ChatButton />}
				</div>
				<FlexSpacer />
				<Button
					id='home-redirect'
					type={'link'}
					className={'logo-button'}
					direction={'/'}
				>
					<LogoInline
						width={200}
						color={'white'}
					/>
				</Button>
			</div>
		</>
	)
}

export default ButtonBar
