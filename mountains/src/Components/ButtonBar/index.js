import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import { Skier, Profile } from '../../Images'
import { CARD_TYPES, useCardStateContext, useUserStateContext } from '../../Providers'
import { Button, FlexSpacer } from '../Reusable'

import './styles.css'
import LogoInline from '../../Images/LogoInline'
import { Link } from 'react-router-dom'
import MenuPanels from './MenuPanels'

const LoginButton = () => {
	const { cardDispatch } = useCardStateContext()

	return (
		<Button
			id='login-button-adventures'
			className={cx('button-bar-button', 'login-button')}
			onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.login })}
		>
			Log In
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
			Create an Account
		</Button>
	)
}

const UserProfileButton = () => {
	const { cardDispatch } = useCardStateContext()
	const { userDispatch, loggedInUser, workingUser } = useUserStateContext()
	const [buttonClicked, setButtonClicked] = useState(false)

	const handleProfileButton = () => {
		setButtonClicked(true)
		userDispatch({ type: 'workingUser', payload: loggedInUser })
	}

	useEffect(() => {
		if (workingUser?.id === loggedInUser?.id && buttonClicked) {
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.profile })
			setButtonClicked(false)
		}
	}, [workingUser, buttonClicked, loggedInUser?.id, cardDispatch])

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
