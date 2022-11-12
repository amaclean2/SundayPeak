import { Link } from 'react-router-dom'
import { Button } from '../Components/Reusable'
import LogoInline from '../Images/LogoInline'

import './styles.css'

const LandingPageHeader = () => {
	return (
		<div className='flex-box landing-header'>
			<LogoInline
				width={200}
				color={'green'}
			/>
			<div className='flex-spacer' />
			<div className='action-buttons'>
				<Link to='/login'>
					<Button className='secondary-button'>Login</Button>
				</Link>
				<Link to='/signup'>
					<Button className='secondary-button'>Create an Account</Button>
				</Link>
			</div>
		</div>
	)
}

export default LandingPageHeader
