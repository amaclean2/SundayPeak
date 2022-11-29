import cx from 'classnames'

import { Skier, Profile } from '../../Images'
import { CARD_TYPES, useCardStateContext, useUserStateContext } from '../../Providers'
import { Button, FlexSpacer, MobileMenu } from '../Reusable'

import './styles.css'
import LogoInline from '../../Images/LogoInline'
import { Link } from 'react-router-dom'
import MenuPanels from './MenuPanels'
import getContent from '../../TextContent'

const LoginButton = () => {
	const { cardDispatch } = useCardStateContext()
	const { screenType } = useCardStateContext()

	if (screenType.mobile) {
		return (
			<Button
				className={'mobile-menu-button'}
				onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.login })}
			>
				{getContent('buttonText.login')}
			</Button>
		)
	}

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
	const { screenType } = useCardStateContext()

	if (screenType.mobile) {
		return (
			<Button
				className={'mobile-menu-button'}
				onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.signup })}
			>
				{getContent('buttonText.signup')}
			</Button>
		)
	}

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
	const { cardDispatch, screenType } = useCardStateContext()
	const { userDispatch, loggedInUser } = useUserStateContext()

	const handleProfileButton = () => {
		userDispatch({ type: 'workingUser', payload: loggedInUser })
		cardDispatch({ type: 'openCard', payload: CARD_TYPES.profile })
	}

	if (screenType.mobile) {
		return (
			<Button
				className={'mobile-menu-button'}
				onClick={() => handleProfileButton()}
			>
				{getContent('buttonText.profile')}
			</Button>
		)
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
	const { cardDispatch, screenType } = useCardStateContext()

	if (screenType.mobile) {
		return (
			<Button
				className={'mobile-menu-button'}
				onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.adventures })}
			>
				{getContent('buttonText.adventures')}
			</Button>
		)
	}

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
					<div className='regular-buttons'>
						{!isLoggedIn && <SignUpButton />}
						{!isLoggedIn && <LoginButton />}
						{isLoggedIn && <UserProfileButton />}
						<ActivitiesButton />
					</div>
					<MobileMenu direction={'left'}>
						{!isLoggedIn && <SignUpButton />}
						{!isLoggedIn && <LoginButton />}
						{isLoggedIn && <UserProfileButton />}
						<ActivitiesButton />
					</MobileMenu>
					<FlexSpacer />
					<Link
						id='home-redirect'
						className={'secondary-button'}
						to={'/about'}
					>
						<LogoInline
							width={200}
							color={window.screen.width >= 500 ? 'white' : 'green'}
						/>
					</Link>
				</div>
			)}
			<MenuPanels />
		</>
	)
}

export default ButtonBar
