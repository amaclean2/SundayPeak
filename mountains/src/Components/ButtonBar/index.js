import { useUserStateContext } from 'sundaypeak-treewells'

import { Button, FlexSpacer } from 'Components/Reusable'
import getContent from 'TextContent'
import LogoInline from 'Images/Logos/LogoInline'

import './styles.css'

const LoginButton = () => (
	<Button
		id='login-button-adventures'
		className={'secondary-button'}
		direction='/login'
	>
		{getContent('buttonText.login')}
	</Button>
)

const SignUpButton = () => (
	<Button
		className={'secondary-button'}
		direction={'/signup'}
		id={'signup-button-adventures'}
	>
		{getContent('buttonText.signup')}
	</Button>
)

const ChatButton = () => (
	<Button
		id={'open-conversations-mobile'}
		className={'secondary-button'}
		direction={'/conversations'}
	>
		Conversations
	</Button>
)

const UserProfileButton = () => (
	<Button
		secondaryButton
		id='user-profile-button'
		direction={'/user'}
	>
		{getContent('buttonText.profile')}
	</Button>
)

const AdventuresButton = () => (
	<Button
		secondaryButton
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
					direction={'/about'}
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
