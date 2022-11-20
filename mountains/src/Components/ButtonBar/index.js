import cx from 'classnames'

import { Skier, Profile } from '../../Images'
import { CARD_TYPES, useCardStateContext, useUserStateContext } from '../../Providers'
import { Button, FlexSpacer } from '../Reusable'

import './styles.css'
import LogoInline from '../../Images/LogoInline'
import { Link } from 'react-router-dom'
import MenuPanels from './MenuPanels'
import getContent from '../../TextContent'

const LoginButton = () => {
	const { cardDispatch } = useCardStateContext()

	return (
		<Button
			id='login-button-adventures'
			className={cx('button-bar-button', 'login-button')}
			onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.login })}
		>
			{getContent('buttonText.login')}
		</Button>
	)
}

const SignUpButton = () => {
	const { cardDispatch } = useCardStateContext()

	return (
		<Button
			className={cx('button-bar-button', 'signup-button')}
			onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.signup })}
			id={'signup-button-adventures'}
		>
			{getContent('buttonText.signup')}
		</Button>
	)
}

const UserProfileButton = () => {
	const { cardDispatch } = useCardStateContext()
	const { userDispatch, loggedInUser } = useUserStateContext()

	const handleProfileButton = () => {
		userDispatch({ type: 'workingUser', payload: loggedInUser })
		cardDispatch({ type: 'openCard', payload: CARD_TYPES.profile })
	}

	return (
		<Button
			className='button-bar-button'
			id='user-profile-button'
			onClick={() => handleProfileButton()}
		>
			<Profile />
		</Button>
	)
}

const ActivitiesButton = () => {
	const { cardDispatch } = useCardStateContext()

	return (
		<Button
			className='button-bar-button'
			id='activities-button-adventures'
			onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.adventures })}
		>
			<Skier />
		</Button>
	)
}

const ButtonBar = () => {
	const { displayCardBoolState } = useCardStateContext()
	const { isLoggedIn } = useUserStateContext()

	if (isLoggedIn === undefined) {
		return null
	}

	return (
		<>
			{!displayCardBoolState && (
				<div className='button-bar flex-box'>
					{!isLoggedIn && <SignUpButton />}
					{!isLoggedIn && <LoginButton />}
					{isLoggedIn && <UserProfileButton />}
					<ActivitiesButton />
					<FlexSpacer />
					<Link
						id='home-redirect'
						className={'secondary-button'}
						to={'/about'}
					>
						<LogoInline
							width={200}
							color={'white'}
						/>
					</Link>
				</div>
			)}
			<MenuPanels />
		</>
	)
}

export default ButtonBar
