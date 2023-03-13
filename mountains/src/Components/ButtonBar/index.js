import { Link } from 'react-router-dom'

import { useUserStateContext } from 'Hooks/Providers'
import { FlexSpacer } from 'Components/Reusable'
import getContent from 'TextContent'
import LogoInline from 'Images/Logos/LogoInline'

import './styles.css'

const LoginButton = () => (
	<Link
		id='login-button-adventures'
		className={'secondary-button button flex-box'}
		to={'/login'}
	>
		{getContent('buttonText.login')}
	</Link>
)

const SignUpButton = () => (
	<Link
		className={'secondary-button button flex-box'}
		to={'/signup'}
		id={'signup-button-adventures'}
	>
		{getContent('buttonText.signup')}
	</Link>
)

const ChatButton = () => (
	<Link
		id={'open-conversations-mobile'}
		className={'secondary-button button flex-box'}
		to={'/conversations'}
	>
		Conversations
	</Link>
)

const UserProfileButton = () => (
	<Link
		className='secondary-button button flex-box'
		id='user-profile-button'
		to={'/user'}
	>
		{getContent('buttonText.profile')}
	</Link>
)

const AdventuresButton = () => (
	<Link
		className='secondary-button button flex-box'
		id='button-adventures'
		to={'/adventure'}
	>
		{getContent('buttonText.adventures')}
	</Link>
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
				<Link
					id='home-redirect'
					to={'/about'}
				>
					<LogoInline
						width={200}
						color={'white'}
					/>
				</Link>
			</div>
		</>
	)
}

export default ButtonBar
