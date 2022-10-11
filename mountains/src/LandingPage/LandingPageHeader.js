import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Components/Reusable'

import { CARD_STATES, useCardStateContext } from '../Providers'

const LandingPageHeader = () => {
	const { openCard } = useCardStateContext()

	const handleOpenLogin = () => {
		openCard(CARD_STATES.login)
	}

	const handleOpenSignUp = () => {
		openCard(CARD_STATES.signup)
	}

	return (
		<div className='flex-box'>
			<h1>Backyard Friends</h1>
			<div className='flex-spacer' />
			<div className='action-buttons'>
				<Link to='/discover'>
					<Button onClick={handleOpenLogin}>Login</Button>
				</Link>
				<Link to='/discover'>
					<Button onClick={handleOpenSignUp}>Create an Account</Button>
				</Link>
			</div>
		</div>
	)
}

export default LandingPageHeader
