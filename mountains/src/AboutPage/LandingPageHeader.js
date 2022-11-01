import { Link } from 'react-router-dom'
import { Button } from '../Components/Reusable'
import LogoInline from '../Images/LogoInline'

import { CARD_STATES, useCardStateContext } from '../Providers'

import './styles.css'

const LandingPageHeader = () => {
	const { openCard } = useCardStateContext()

	const handleOpenLogin = () => {
		openCard(CARD_STATES.login)
	}

	const handleOpenSignUp = () => {
		openCard(CARD_STATES.signup)
	}

	return (
		<div className='flex-box landing-header'>
			<LogoInline
				width={200}
				color={'green'}
			/>
			<div className='flex-spacer' />
			<div className='action-buttons'>
				<Link to='/discover'>
					<Button
						onClick={handleOpenLogin}
						className='secondary-button'
					>
						Login
					</Button>
				</Link>
				<Link to='/discover'>
					<Button
						onClick={handleOpenSignUp}
						className='secondary-button'
					>
						Create an Account
					</Button>
				</Link>
			</div>
		</div>
	)
}

export default LandingPageHeader
